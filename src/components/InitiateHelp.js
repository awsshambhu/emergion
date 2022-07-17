import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField
} from "@mui/material";
import { teal } from "@mui/material/colors";
import { Container } from "@mui/system";
import { useNavigate } from "react-router-dom";

function InitiateHelp() {
    const navigate = useNavigate();
  const [needAmbulance, setNeedAmbulance] = useState(false);
  const [needHospital, setNeedHospital] = useState(false);
  const [needVolunteer, setNeedVolunteer] = useState(false);
  const [needDoctor, setNeedDoctor] = useState(false);
  const [number, setNumber] = useState("");
  const [ambulanceType, setAmbulanceType] = useState("");
  const [location, setLocation] = useState({})
  const color1 = teal[10],
    color2 = teal[400];
  const callInitiate = (e) => {
    e.preventDefault()
    let data = {
        needAmbulance: needAmbulance?1:0,
        needHospital: needHospital?1:0,
        needCompanion: needVolunteer?1:0,
        needDoctor: needDoctor?1:0,
        number,
        location: `${location.lat},${location.lng}` 
    }
    
    axios.post('https://umqiph6o17.execute-api.us-east-1.amazonaws.com/default/requestCall', data)
      .then(function (res) {
        // console.log(res);
        if (res.data.statusCode===200) {
            const user = JSON.parse(res.data.body);
            localStorage.setItem("userId", user.UserId)
            data['location'] = location
            data['reqId'] =user.reqId
            localStorage.setItem('requestData', JSON.stringify({
                data
            }))
            navigate(`/mapview/${user.reqId}`)
        }
        
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
        // console.log(position);
      setLocation({
        lat: parseFloat(position.coords.latitude),
        lng: parseFloat(position.coords.longitude)
      });
    });
  }, []); 

  return (
    <div>
      <Container
        sx={{
          backgroundColor: color1,
          border: "1px solid #ccc",
          borderRadius: "10px",
          width: 500,
          m: 5
        }}
      >
        <h3>Get Help</h3>
        <Container>
          <Button
            sx={{ m: 1 }}
            onClick={(e) => setNeedAmbulance(!needAmbulance)}
            variant={needAmbulance ? "contained" : "outlined"}
          >
            Ambulane
          </Button>
          <Button
            sx={{ m: 1 }}
            onClick={(e) => setNeedHospital(!needHospital)}
            variant={needHospital ? "contained" : "outlined"}
          >
            Hospital
          </Button>
          <Button
            sx={{ m: 1 }}
            onClick={(e) => setNeedDoctor(!needDoctor)}
            variant={needDoctor ? "contained" : "outlined"}
          >
            Doctor
          </Button>
          <Button
            sx={{ m: 1 }}
            onClick={(e) => setNeedVolunteer(!needVolunteer)}
            variant={needVolunteer ? "contained" : "outlined"}
          >
            Companion
          </Button>
          <Button
            sx={{ m: 1 }}
            variant="outlined"
          >
            Pharmacy
          </Button>
          <Button
            sx={{ m: 1 }}
            variant="outlined"
          >
            Blood Bank
          </Button>
        </Container>
        <form onSubmit={(e)=>callInitiate(e)}>
        <Container>
          <TextField
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            type="tel"
            sx={{ my: 1 }}
            id="outlined-basic"
            label="Contact No"
            variant="outlined"
            required
          />
        </Container>
        <Container>
          <Button
            sx={{ m: 1, backgroundColor: color2, color: "#fff" }}
            variant="Contained"
            type="submit"
          >
            Call
          </Button>
        </Container>
        </form>
      </Container>
    </div>
  );
}

export default InitiateHelp;
