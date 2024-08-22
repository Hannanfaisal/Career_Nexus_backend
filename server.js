const express = require("express");
const {PORT} = require("./config");
const dbConnection = require("./database");
const authRouter = require("./routes/authRoutes");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const companyRouter = require("./routes/companyRoutes");
const axios = require("axios");
const { subscribe } = require("./controllers/subscriptionController");
const subscriptionRoutes = require("./routes/subscriptionRoutes");

// const qs = require('querystring');//


const corsOptions = {
  credentials: true,
  origin: ["http://localhost:5173"],
};
const app = express();
app.use(express.json({limit: '50mb'}));
app.use(cookieParser())
app.use(cors(corsOptions))

app.use(cookieParser())
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter)
app.use('/api/company',companyRouter)
app.use(subscriptionRoutes)
app.use(errorHandler);




dbConnection()

app.get('/', (req,res)=>{
    res.cookie("cook", "Hello cokkies")
    console.log(req.cookies.zoomToken)
    res.send('fdf')

})


const ZOOM_API_URL = 'https://api.zoom.us/v2/users/me/meetings';
const ZOOM_TOKEN = 'eyJzdiI6IjAwMDAwMSIsImFsZyI6IkhTNTEyIiwidiI6IjIuMCIsImtpZCI6IjQzOTYzZmMxLWYwNmMtNGU2NC05MTY1LTBlYmZmY2I0NGYzYyJ9.eyJhdWQiOiJodHRwczovL29hdXRoLnpvb20udXMiLCJ1aWQiOiJ3TldmS0w2dFNYMmFPNmhKVVlXYnp3IiwidmVyIjo5LCJhdWlkIjoiMmY4ZjZjOGRjNDRlNzk0YmUwMzg4ZWQ4N2U4MTJkY2MiLCJuYmYiOjE3MjQyMzYzNjEsImNvZGUiOiJQZXhSd1A5RlM0eWhQcXl0NmxNLVBncG9RZG5WYWZ4bDkiLCJpc3MiOiJ6bTpjaWQ6RWd3Nm10Sk9UbktGTFNYVjZUS0pnIiwiZ25vIjowLCJleHAiOjE3MjQyMzk5NjEsInR5cGUiOjMsImlhdCI6MTcyNDIzNjM2MSwiYWlkIjoibVR0MWlpcnlRRE9idk5SY3F5M2dMQSJ9.-r90M9G4-f65RyMwar2YlATc_XJFp2hM9HrmykZnAKWNUrWFS4OKGPSmgExhXWdhRpWBi6CWx9Jxq6C3zqeFdA'


app.get('/api/meetings', async (req, res) => {
  try {
    const response = await axios.get(ZOOM_API_URL, {
      headers: {
        'Authorization': `Bearer ${ZOOM_TOKEN}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).send(error.message);
  }
});

app.get('/api/meetings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${ZOOM_API_URL}${id}`, {
      headers: {
        'Authorization': `Bearer ${ZOOM_TOKEN}`,
      },
    });
    console.log(response)
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).send(error.message);
  }
});




const CLIENT_ID = 'Egw6mtJOTnKFLSXV6TKJg'; // Your Zoom Client ID
const CLIENT_SECRET = 'SCCgGkCdPvlRKn1E6njZpWlrB3N8kfPy'; // Your Zoom Client Secret
const ACCOUNT_ID = 'mTt1iiryQDObvNRcqy3gLA'; // Your Zoom Account ID

// Base64 encode the client_id and client_secret
const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

app.get('/zoom-token', async (req, res) => {
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://zoom.us/oauth/token',
      params: {
        grant_type: 'account_credentials',
        account_id: ACCOUNT_ID,
      },
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log(response.data.access_token)
    res.cookie("zoomToken", response.data.access_token )
    console.log('token')




    // const t = req.cookies.zoomToken
    // console.log(t);
   

 
    

    res.json({
      access_token: response.data.access_token,
      token_type: response.data.token_type,
      expires_in: response.data.expires_in,
    });
  } catch (error) {
    if (error.response) {
      console.error('Error response from Zoom:', error.response.data);
      res.status(error.response.status).json({
        error: error.response.data,
        message: 'Failed to fetch Zoom token',
      });
    } else {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
});




app.post('/api/meetings', async (req, res) => {
  const meetingData = req.body;

  try {
    
    let t = req.cookies.zoomToken
    console.log(t)
    
    const response = await axios.post(ZOOM_API_URL, meetingData, {
      
      headers: {
        'Authorization': `Bearer ${ZOOM_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).send(error.message);
  }
});





app.listen(PORT,()=>{
    console.log(`Listening at port no. ${PORT}`);
});