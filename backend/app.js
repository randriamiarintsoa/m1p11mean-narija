// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3000;

// app.use(cors());

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:4200', // Replace with your Angular application's origin
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  }));

const connectDB = async () => {
    try {
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/mean'
    //   , { useNewUrlParser: true, useUnifiedTopology: true }
      );
      console.error('CONNECT TO DATABASE:', conn);
    } catch (error) {
        console.error('COULD NOT CONNECT TO DATABASE:', error.message);
    }
}

connectDB();

// Define user schema and model
const userSchema = new mongoose.Schema({
    name :{
        type: String,
        required: true,
    },
    firstname :{
        type: String,
        required: true,
    },
    phone :{
        type: String,
        required: true,
        unique: true,
    },
    email :{
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        enum: ['client', 'employer', 'manager'], // Define possible roles
        default: 'user', // Set a default role if not provided
      },
  /*  name: String,
    firstname: String,
    phone: String,
    email: String,
    role : ,
    age: Number,
    password: String,*/
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
    
        const user = await User.findOne({email});
        if (!user) {
            res.status(404).send("user not found");
        } 
        
        const passwordMacth = await bcrypt.compare(password, user.password);
        if (!passwordMacth) {
            res.status(404).send("invalide password");
        } else {
            const token = jwt.sign({ userId: user.id, name: user.name }, 'your_secret_key', { expiresIn: '1h' });
            const tokenExpiration = new Date().getTime() + 3600 * 1000; 
            res.json({ token, tokenExpiration, user });
        }
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});
  
  // Protected route
app.get('/protected', (req, res) => {
    // Middleware to check the token before accessing the protected route
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    jwt.verify(token, 'your_secret_key', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token is not valid' });
      }
  
      // Token is valid, you can proceed with the protected logic
      res.json({ message: 'Protected route accessed successfully', user: decoded });
    });
  });

const User = mongoose.model('User', userSchema);

// Create a new user
app.post('/users', async (req, res) => {
    try {
        const { name, email, age, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, age, password: hashedPassword });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user by id
app.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(404).json({ message: 'User not found'  });
    }
});
// Define service schema and model
const serviceSchema = new mongoose.Schema({
    name :{
        type: String,
        required: true,
    },
    delai :{
        type: String,
        required: true,
    },
    prix :{
        type: String,
        required: true,
    },
    image :{
        type: String,
        required: true,
    },
});

const Service = mongoose.model('Service', serviceSchema);
// Create a new service
app.post('/service', async (req, res) => {
    try {
        const { name, delai, prix, image } = req.body;

        const newService = new Service({ name, delai, prix, image });
        await newService.save();
        res.status(201).json(newService);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all services
app.get('/services', async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get service by id
app.get('/service/:id', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json(service);
    } catch (err) {
        res.status(404).json({ message: 'Service not found'  });
    }
});
// Define service schema and model
const rendezvousSchema = new mongoose.Schema({
    clientId :{
        type: String,
        required: true,
    },
    employerId :{
        type: String,
        required: true,
    },
    serviceId :{
        type: String,
        required: true,
    },
    date :{
        type: String,
        required: true,
    },
    tarifs :{
        type: String,
        required: true,
    },
});
const Rendezvous = mongoose.model('Rendezvous', rendezvousSchema);
// Create a new Rendez vous
app.post('/rendezvous', async (req, res) => {
    try {
        const { clientId, employerId, serviceId, date, tarifs} = req.body;

        const newRendezvous = new Service({ clientId, employerId, serviceId, date, tarifs });
        await newRendezvous.save();
        res.status(201).json(newRendezvous);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all Rendez vous
app.get('/rendezvous', async (req, res) => {
    try {
        const rendezvous = await Rendezvous.find();
        res.json(rendezvous);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get rendez vous by id
app.get('/rendezvous/:id', async (req, res) => {
    try {
        const rendezvous = await Rendezvous.findById(req.params.id);
        if (!rendezvous) {
            return res.status(404).json({ message: 'Rendez vous not found' });
        }
        res.json(rendezvous);
    } catch (err) {
        res.status(404).json({ message: 'Rendez vous not found'  });
    }
});
// home route
app.get('/', (req, res) => {
  res.send('Home ...');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});