import axios from "axios";

import React, {useState, useEffect} from 'react'

function Home() {
    const [stats, setStats] = useState([])
    useEffect(() => {
        const data = {
            reason: "stats"
          };
          axios
            .post(
              "https://1yq3b1tyh8.execute-api.us-east-1.amazonaws.com/default/volunteerApi",
              data
            )
            .then(function (res) {
              const list = JSON.parse(res.data.body);
              setStats(list);
            //   console.log(list[0])
            })
            .catch(function (error) {
              console.log(error);
            });
    }, [])
    
  return (
    <div className='banner'>
        <div>
        {stats.length && Object.keys(stats[0]).map(key=>
            <div className="stats" key={key}>
                <h1>{stats[0][key]}</h1>
                <span>{key.replace(/Count/g, "").replace(/total/g, "").toUpperCase()}</span>
            </div>
        )}</div>
    </div>
  )
}

export default Home