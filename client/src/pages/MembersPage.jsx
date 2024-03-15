import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/members")
      .then((response) => {
        setMembers(response.data);
      })
      .catch((error) => {
        alert("Error fetching members", error);
      });
  }, []);

  return (
    <>
      <div className="flex justify-between items-center my-10 ">
        <p className="text-2xl font-medium">Members Page</p>
        <Button variant="contained" color="primary" onClick={() => navigate("/create")}>
          Create Member
        </Button>
      </div>
      <TableContainer className="bg-slate-500 rounded-lg ">
        <Table aria-label="Members table " >
          <TableHead className="bg-slate-700 rounded-lg ">
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Currently Borrowed</TableCell>
              <TableCell>Debt</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member._id}>
                <TableCell>{member.username}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>{member.borrowed_title}</TableCell>
                <TableCell>{member.debt}</TableCell>
                <TableCell>
                  <Button onClick={() => navigate(`/edit/${member.username}`, { state: member })}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default MembersPage;
