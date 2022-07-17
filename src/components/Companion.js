import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Button, TextField } from "@mui/material";
import { Container } from "@mui/system";
import "../App.css";
import { Link } from "react-router-dom";

const markerIcons = {
  paitent: "https://marker-img.s3.amazonaws.com/PATIENTSS3.png"
};

function CustomLi({ data, userId, getPaitentData }) {
  const updateResponse = (id) => {
    const reqData = {
      reason: "requestupdate",
      requestId: data.Id,
      volunteerId: userId,
      responseStatus: id
    };
    axios
      .post(
        "https://1yq3b1tyh8.execute-api.us-east-1.amazonaws.com/default/volunteerApi",
        reqData
      )
      .then(function (res) {
        // console.log(res);
        getPaitentData();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <li className="patientList">
      <div className="info">
        <h3>{data.paitentName}</h3>
        <div>
          <span>Ph:{data.contact}</span>
          <span>Age:{data.age}</span>
          <span>Sex:{data.sex}</span>
          <span>Request Date:{data.requested_date}</span>
        </div>
      </div>
      <Button
        sx={{ height: 60, backgroundColor: "#000", color: "#fff" }}
        variant="Contained"
        onClick={() => updateResponse(data.needAccept)}
      >
        {data.needAccept === 1 ? "Accept" : null}
        {data.needAccept === 0 ? "Decline" : null}
      </Button>
    </li>
  );
}

function Companion() {
  const [number, setNumber] = useState("");
  const [location, setLocation] = useState({});
  const [otp, setOtp] = useState("");
  const [paitentData, setPaitentData] = useState([]);
  const [userId, setUserId] = useState(0);

  const getPaitentData = (id = null) => {
    // console.log(id);
    const data = {
      reason: "request",
      volunteerId: id ? id : userId,
      range: 1
    };
    axios
      .post(
        "https://1yq3b1tyh8.execute-api.us-east-1.amazonaws.com/default/volunteerApi",
        data
      )
      .then(function (res) {
        setUserId(id)
        // console.log(res);
        setPaitentData(JSON.parse(res.data.body));
        // console.log(JSON.parse(res.data.body), res);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const saveLocation = (id) => {
    const data = {
        reason: "setlocation",
        volunteerId: id,
        location: `${location.lat},${location.lng}`
      };
      axios
        .post(
          "https://1yq3b1tyh8.execute-api.us-east-1.amazonaws.com/default/volunteerApi",
          data
        )
        .then(function (res) {
        //   console.log(res);
          setTimeout(() => {
            saveLocation(id)
          }, 5000);
        })
        .catch(function (error) {
          console.log(error);
        });
  }

  const signIn = (e) => {
    e.preventDefault();
    const data = {
      reason: "signin",
      phno: number,
      userType: 1
    };
    axios
      .post(
        "https://1yq3b1tyh8.execute-api.us-east-1.amazonaws.com/default/volunteerApi",
        data
      )
      .then(function (res) {
        // console.log(res);
        setUserId(JSON.parse(res.data.body)[0].userId);
        getPaitentData(JSON.parse(res.data.body)[0].userId);
        localStorage.setItem('companionId', JSON.parse(res.data.body)[0].userId);
        saveLocation(JSON.parse(res.data.body)[0].userId);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const signOut = () => {
    setUserId(0);
    localStorage.setItem("companionId", 0);
  };

  useEffect(() => {
    const Id = localStorage.getItem('companionId') 
    Number(Id) && getPaitentData(Number(Id));
    navigator.geolocation.getCurrentPosition(function (position) {
    //   console.log(position);
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });

    
  }, []);

  const containerStyle = {
    width: "60vw",
    height: "600px",
    padding: "10px"
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBb2iN7Bl_G0PxsTofKHDmCSqkXe_dYwps"
  });
  const [map, setMap] = React.useState(null);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);
  return (
    <div>
      {userId === 0 ? (
        <Container
          sx={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            width: 500,
            m: 5
          }}
        >
          <h3>Sign In</h3>
          <form onSubmit={(e) => signIn(e)}>
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
              <TextField
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                type="tel"
                sx={{ my: 1 }}
                id="outlined-basic"
                label="Otp"
                variant="outlined"
                required
              />
            </Container>
            <Container>
              <Button
                sx={{ m: 1, backgroundColor: "#000", color: "#fff" }}
                variant="Contained"
                type="submit"
              >
                SignIn
              </Button>
            </Container>
          </form>
        </Container>
      ) : (
        <>
          <Button
            sx={{ m: 1, backgroundColor: "#000", color: "#fff" }}
            variant="Contained"
            onClick={() => signOut()}
          >
            SignOut
          </Button>
          <div className="mapview">
            <div
              style={{
                width: "25vw",
                padding: "10px",
                maxHeight: "600px",
                overflowY: "scroll"
              }}
            >
              <h2>Request around you</h2>
              {paitentData.length &&
                paitentData.map((data) => (
                  <CustomLi
                    data={data}
                    userId={userId}
                    getPaitentData={getPaitentData}
                    key={data.Id}
                  />
                ))}
            </div>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={location}
              zoom={15}
              onUnmount={onUnmount}
            >
              <Marker position={location} />
              {paitentData.length &&
                paitentData
                  .slice(0, 5)
                  .map((data) => (
                    <Marker
                      key={data.Id}
                      icon={markerIcons.paitent}
                      position={{ lat: data.lat, lng: data.lng }}
                    />
                  ))}
              <></>
            </GoogleMap>
          </div>
        </>
      )}
    </div>
  );
}

export default Companion;
