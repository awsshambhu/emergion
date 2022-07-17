import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";


const markerIcons = {
  ambluance: "https://marker-img.s3.amazonaws.com/ambulance+(1).png",
  hospital: "https://marker-img.s3.amazonaws.com/hospital.png",
  doctors: "https://marker-img.s3.amazonaws.com/doctor2.png",
  companion: "https://marker-img.s3.amazonaws.com/user-removebg-preview.png"
};

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0
  },
  "&:before": {
    display: "none"
  }
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)"
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1)
  }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)"
}));

function CustomLi({ id, data }) {
  return (
    <>
      {id === "hospital" ? (
        <li>
            <div>
          <h3>{data.hospitalName}</h3>
          <div className="info">
            <span>Address: {data.hospitalAddress}</span>
            <span>Distance: {data.distance}Km</span>
          </div>
          </div>
          <Button
            sx={{ m: 1, backgroundColor: "#000", color: "#fff" }}
            variant="Contained"
          >
            Book
          </Button>
        </li>
      ) : null}
      {id === "ambulance" ? (
        <li>
          <div>
            <h3>{data.ambulanceName}</h3>
            <div className="info">
              <span>Ph: {data.contact}</span>
              <span>Fare: Rs.{data.fair}</span>
              <span>Vehical Id: {data.vehicalId}</span>
            </div>
          </div>
          <Button
            sx={{ m: 1, backgroundColor: "#000", color: "#fff" }}
            variant="Contained"
          >
            Book
          </Button>
        </li>
      ) : null}
      {id === "companion" ? (
        <li>
            <div>
          <h3>{data.companionName}</h3>
          <div>
            <span>Ph: {data.contact}</span>
            <span>Rating: {data.rating}</span>
            <span>Served: {data.totalServedCount}</span>
          </div>
          </div>
        </li>
      ) : null}
      {id === "doctor" ? (
        <li>
            <div>
          <h3>{data.doctorName}</h3>
          <div className="info">
            <span>Address: {data.doctorAddress}</span>
            <span>Ph: {data.contact}</span>
            <span>Distance: {data.distance}Km</span>
          </div>
          </div>
          <Button
            sx={{ m: 1, backgroundColor: "#000", color: "#fff" }}
            variant="Contained"
          >
            Book
          </Button>
        </li>
      ) : null}
    </>
  );
}

function CustomizedAccordions({
  ambulanceData,
  hospitalData,
  doctorsData,
  companionData
}) {
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div style={{ width: "25vw", margin: "10px" }}>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>Ambulance</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ maxHeight: 600, overflowY: "scroll" }}>
          {ambulanceData.map((data) => (
            <CustomLi id={"ambulance"} data={data} />
          ))}
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>Hospital</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ maxHeight: 600, overflowY: "scroll" }}>
          {hospitalData.map((data) => (
            <CustomLi id={"hospital"} data={data} />
          ))}
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>Doctor</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ maxHeight: 600, overflowY: "scroll" }}>
          {doctorsData.map((data) => (
            <CustomLi id={"doctor"} data={data} />
          ))}
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
          <Typography>Companion</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ maxHeight: 600, overflowY: "scroll" }}>
          {companionData.map((data) => (
            <CustomLi id={"companion"} data={data} />
          ))}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

function MapViewComponent({ handleStatus }) {
  const [coords, setCoords] = useState({});
  const [reqId, setReqId] = useState(0);
  const [ambulanceData, setAmbulanceData] = useState([]);
  const [hospitalData, setHospitalData] = useState([]);
  const [doctorsData, setDoctorsData] = useState([]);
  const [requestData, setRequestData] = useState({});
  const [companionData, setCompanionData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const containerStyle = {
    width: "60vw",
    height: "650px",
    margin: "10px"
  };

  const getCompanionData = (reqData) => {
    const data = {
      requestId: reqData.reqId,
      range: 1,
      returnType: 3,
      isFirstCall: 0
    };
    axios
      .post(
        "https://6vx1botcx5.execute-api.us-east-1.amazonaws.com/default/getApi",
        data
      )
      .then(function (res) {
        if (
          res.data.statusCode === 200 &&
          data.returnType === 3 &&
          !JSON.parse(res.data.result).isSame
        ) {
          setCompanionData(JSON.parse(res.data.body));
        }
        setTimeout(() => {
          getCompanionData(reqData);
        }, 5000);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getDoctorsData = (reqData) => {
    const data = {
      requestId: reqData.reqId,
      range: 1,
      returnType: 4,
      isFirstCall: 0
    };
    axios
      .post(
        "https://6vx1botcx5.execute-api.us-east-1.amazonaws.com/default/getApi",
        data
      )
      .then(function (res) {
        if (res.data.statusCode === 200 && data.returnType === 4) {
          setDoctorsData(JSON.parse(res.data.body));
        }
        if (reqData.needCompanion) {
          getCompanionData(reqData);
        }
        // console.log(JSON.parse(res.data.body));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getHospitalData = (reqData) => {
    const data = {
      requestId: reqData.reqId,
      range: 1,
      returnType: 1,
      isFirstCall: 0
    };
    // console.log(data);
    axios
      .post(
        "https://6vx1botcx5.execute-api.us-east-1.amazonaws.com/default/getApi",
        data
      )
      .then(function (res) {
        if (res.data.statusCode === 200 && data.returnType === 1) {
          setHospitalData(JSON.parse(res.data.body));
          reqData.needDoctor && getDoctorsData(reqData);
        }
        // console.log(res);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    const reqData = JSON.parse(localStorage.getItem("requestData"))["data"];
    setReqId(searchParams.get("id"));
    setRequestData(reqData);
    setCoords(reqData.location);
    // console.log(coords);
    const data = {
      requestId: reqData.reqId,
      range: 1,
      returnType: reqData.needAmbulance
        ? 2
        : requestData.needHospital
        ? 1
        : requestData.needDoctor
        ? 4
        : 3,
      isFirstCall: 0
    };
    axios
      .post(
        "https://6vx1botcx5.execute-api.us-east-1.amazonaws.com/default/getApi",
        data
      )
      .then(function (res) {
        if (res.data.statusCode === 200 && data.returnType === 2) {
          setAmbulanceData(JSON.parse(res.data.body));
          if (reqData.needHospital) getHospitalData(reqData);
          if (!reqData.needHospital && reqData.needDoctor)
            getDoctorsData(reqData);
          if (
            !reqData.needHospital &&
            !reqData.needDoctor &&
            reqData.needCompanion
          )
            getCompanionData(reqData);
        } else if (res.data.statusCode === 200 && data.returnType === 1) {
          setHospitalData(JSON.parse(res.data.body));
          if (reqData.needDoctor) getDoctorsData(reqData);
          if (!reqData.needDoctor && reqData.needCompanion)
            getCompanionData(reqData);
        } else if (res.data.statusCode === 200 && data.returnType === 4) {
          setDoctorsData(JSON.parse(res.data.body));
          if (reqData.needCompanion) getCompanionData(reqData);
        } else if (res.data.statusCode === 200 && data.returnType === 3) {
          !JSON.parse(res.data.result).isSame &&
            setCompanionData(JSON.parse(res.data.body));
          setTimeout(() => {
            getCompanionData(reqData);
          }, 5000);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBb2iN7Bl_G0PxsTofKHDmCSqkXe_dYwps"
  });
  const [map, setMap] = React.useState(null);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return isLoaded ? (<>
        <Button
                sx={{ m: 1, backgroundColor: "#000", color: "#fff" }}
                variant="Contained"
              >
                <Link to="/user">Back</Link>
              </Button>
    <div className="mapview">
      <CustomizedAccordions
        ambulanceData={ambulanceData}
        hospitalData={hospitalData}
        doctorsData={doctorsData}
        companionData={companionData}
      />
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={coords}
        zoom={15}
        onUnmount={onUnmount}
      >
        <Marker position={coords} />
        {ambulanceData.length &&
          ambulanceData
            .slice(0, 5)
            .map((data) => (
              <Marker
                key={data.Id}
                icon={markerIcons.ambluance}
                position={{ lat: data.lat, lng: data.lng }}
              />
            ))}
        {hospitalData.length &&
          hospitalData
            .slice(0, 5)
            .map((data) => (
              <Marker
                key={data.Id}
                icon={markerIcons.hospital}
                position={{ lat: data.lat, lng: data.lng }}
              />
            ))}
        {doctorsData.length &&
          doctorsData
            .slice(0, 5)
            .map((data) => (
              <Marker
                key={data.Id}
                icon={markerIcons.doctors}
                position={{ lat: data.lat, lng: data.lng }}
              />
            ))}
        {companionData.length &&
          companionData.map((data) => (
            <Marker
              key={data.Id}
              icon={markerIcons.companion}
              position={{ lat: data.lat, lng: data.lng }}
            />
          ))}

        <></>
      </GoogleMap>
    </div></>
  ) : (
    <></>
  );
}

export default MapViewComponent;
