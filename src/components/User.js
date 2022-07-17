import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import { Container } from "@mui/system";
import { Link } from "react-router-dom";

function CustomLi({ data, userId }) {
  const [rating, setRating] = useState("");
  const updateResponse = (id) => {
    const reqData = {
      reason: "setdisolverequest",
      userId: userId,
      rating: rating ? Number(rating) : 5
    };
    axios
      .post(
        "https://1yq3b1tyh8.execute-api.us-east-1.amazonaws.com/default/volunteerApi",
        reqData
      )
      .then(function (res) {
        data.shouldDisolve = 0;
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <li style={{padding: '0px 30px'}} className="patientList">
      <h3>{data.statusName}</h3>
      <span>Request Date:{data.requestDate}</span>
      <span>Process Date:{data.processDate}</span>
      {data.shouldDisolve ? (
        <>
          <TextField
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            type="text"
            sx={{ my: 1 }}
            id="outlined-basic"
            label="Rating"
            variant="outlined"
          />
          <Button
            sx={{ height: 40, backgroundColor: "#000", color: "#fff" }}
            variant="Contained"
            onClick={() => updateResponse(data.needAccept)}
          >
            Resolve
          </Button>
          <Button
            sx={{ height: 40, backgroundColor: "#000", color: "#fff" }}
            variant="Contained"
          >
            <Link to={`/mapview/${data.Id}`}>Open</Link>
          </Button>
        </>
      ) : null}
    </li>
  );
}

function User() {
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(0);
  const [reqId, setReqId] = useState(0);
  const [rating, setRating] = useState(0);
  const [reqList, setReqList] = useState([]);
  const signIn = (e) => {
    e.preventDefault();
    const data = {
      reason: "signin",
      phno: number,
      userType: 2
    };
    axios
      .post(
        "https://1yq3b1tyh8.execute-api.us-east-1.amazonaws.com/default/volunteerApi",
        data
      )
      .then(function (res) {
        const user = JSON.parse(res.data.body);
        setUserId(user[0].userId);
        getRequestList(user[0].userId);
        localStorage.setItem('userId', user[0].userId)
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const getRequestList = (Id) => {
    const data = {
      reason: "userrequestlist",
      userId: Id
    };
    axios
      .post(
        "https://1yq3b1tyh8.execute-api.us-east-1.amazonaws.com/default/volunteerApi",
        data
      )
      .then(function (res) {
        const list = JSON.parse(res.data.body);
        setReqList(list);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    const Id = localStorage.getItem('userId') 
    Id && setUserId(Number(Id))
    Number(Id) && getRequestList(Id);

  }, [])

  const signOut = ()=>{
    setUserId(0)
    localStorage.setItem('userId', 0)
  }
  

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
      ) : (<>
          <div className="loginPane"><h2>My Request List</h2>
          <Button
                sx={{ m: 1, backgroundColor: "#000", color: "#fff" }}
                variant="Contained"
                onClick={()=>signOut()}
              >
                SignOut
              </Button></div>
        <div
          style={{
            width: "60vw",
            padding: "10px",
            maxHeight: "80vh",
            overflowY: "scroll"
          }}
        >
          {reqList.length &&
            reqList.map((data) => (
              <CustomLi
                data={data}
                userId={userId}
                key={data.Id}
              />
            ))}
        </div></>
      )}
    </div>
  );
}

export default User;
