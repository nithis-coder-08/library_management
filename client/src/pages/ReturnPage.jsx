import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ReturnPage = () => {
  const location = useLocation();
  const activeBorrows = location.state;
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const navigate = useNavigate();

  const handleReturn = () => {
    if (!selectedMember || !selectedBook) {
      alert("Please select member and book");
      return;
    }
    axios
      .put("http://localhost:5000/members/return", {
        username: selectedMember,
        borrowed_title: selectedBook,
      })
      .then((response) => {
        setSelectedMember("");
        setSelectedBook("");
        alert("Book Returned successfully");
        navigate("/");
      })
      .catch((error) => {
        alert("Error returning book. Please try again later", error);
      });
  };

  const handleSelectUser = (event) => {
    const selectedUsername = event.target.value;
    setSelectedMember(selectedUsername);
    const borrowedBook = activeBorrows.find((member) => member.username === selectedUsername);
    if (borrowedBook) {
      setSelectedBook(borrowedBook.borrowed_title);
    }
  };

  return (
    <>
      <Typography variant="h4" component="p">Return</Typography>
      <div className="flex flex-row gap-4 my-8 items-center">
        <FormControl>
          <InputLabel>UserName</InputLabel>
          <Select
          className="flex gap-4 bg-slate-700  rounded-lg w-52"
            value={selectedMember}
            onChange={handleSelectUser}
          >
            {activeBorrows.map((member) => (
              <MenuItem key={member.username} value={member.username}>
                {member.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body1" className="font-semibold">has borrowed =</Typography>
        <Typography variant="body1" className="font-semibold text-secondary">{selectedBook}</Typography>
      </div>
      <div className="flex justify-center item-center">
        <Button variant="contained" color="secondary" onClick={handleReturn}>
          Return Book
        </Button>
      </div>
    </>
  );
};

export default ReturnPage;
