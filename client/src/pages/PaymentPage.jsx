import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const location = useLocation();
  const activeDebts = location.state;
  const [selectedMember, setSelectedMember] = useState("");
  const [debt, setDebt] = useState(null);
  const [pay, setPay] = useState("");
  const navigate = useNavigate();

  const handleReturn = () => {
    if (!selectedMember || !pay) {
      alert("Please select member and pay");
      return;
    }
    axios
      .put("http://localhost:5000/members/pay", {
        username: selectedMember,
        payment: pay,
      })
      .then((response) => {
        setSelectedMember("");
        setPay("");
        setDebt("");
        alert("Payment made successfully");
        navigate("/");
      })
      .catch((error) => {
        alert("Error making payment. Please try again later", error);
      });
  };

  const handleSelectUser = (event) => {
    const selectedUsername = event.target.value;
    setSelectedMember(selectedUsername);
    const debtMember = activeDebts.find((member) => member.username === selectedUsername);
    if (debtMember) {
      setDebt(debtMember.debt);
    }
  };

  return (
    <>
      <p className="text-2xl font-medium">Payment</p>
      <div className="flex flex-row gap-6 justify-center items-center my-9">
        <FormControl>
          <InputLabel>UserName</InputLabel>
          
          <Select 
            className="flex  bg-slate-700  rounded-lg  w-40"
            value={selectedMember}
            onChange={handleSelectUser}
            label="UserName"
          >
            {activeDebts.map((member) => (
              <MenuItem key={member.username} value={member.username}>
                {member.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <p className="text-xl font-semibold text-nowrap">Total Debt: </p>
        <p className="text-xl font-semibold text-danger">{debt}</p>
      </div>
      <div className="flex flex-col gap-3 justify-center item-center my-8">
        <TextField
          required
          type="number"
          label="Pay"
          value={pay}
          onChange={(e) => setPay(e.target.value)}
        />
      </div>
      <div className="flex justify-center item-center">
        <Button variant="contained" color="secondary" onClick={handleReturn}>
          Pay Money
        </Button>
      </div>
    </>
  );
};

export default PaymentPage;
