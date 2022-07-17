import { Container } from "@mui/system";
import React, {useState} from "react";
import {
  FormControl,
  Button,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { teal } from "@mui/material/colors";

function BookAmbulance() {
    const color1 = teal[10],
    color2 = teal[400];
    const [ambulanceType, setAmbulanceType] = useState('')
  return (
    <div>
      <Container
        sx={{
            backgroundColor: color1,
            border: "1px solid #ccc",
            borderRadius: "10px",
            m: 5
        }}
        >
          <h3>Book Ambulance</h3>
        <Container>
          <InputLabel id="demo-simple-select-label">Ambulance Type</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label="Age"
            sx={{
                minWidth: 300
            }}
            placeholder = 'Select Type'
            value={ambulanceType}
            onChange={e=>setAmbulanceType(e.target.value)}
            // onChange={handleChange}
          >
            <MenuItem value={"ALS"}>Advanced Life Support</MenuItem>
            <MenuItem value={"BLS"}>Basic Life Support</MenuItem>
            <MenuItem value={"PTS"}>Patient Life Support</MenuItem>
          </Select>
        </Container>
        <Container>
          <Button
            sx={{ m: 1, backgroundColor: color2, color: "#fff" }}
            variant="Contained"
          >
            Book
          </Button>
        </Container>
      </Container>
    </div>
  );
}

export default BookAmbulance