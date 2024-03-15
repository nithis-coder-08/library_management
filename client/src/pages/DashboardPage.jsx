import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [members, setMembers] = useState([]);
  const [activeDebts, setActiveDebts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeBorrows, setActiveBorrows] = useState([]);
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
      
    axios
      .get("http://localhost:5000/transactions")
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((error) => {
        alert("Error fetching transactions", error);
      });
  }, []);

  useEffect(() => {
    setActiveDebts(members.filter((member) => member.debt > 0));
    setActiveBorrows(members.filter((member) => member.borrowed_title !== ""));
  }, [members]);

  return (
    <>
      <div className="flex flex-col gap-y-8 ">
        <div className="flex justify-between items-center">
          <p className="text-2xl font-medium ">Record Keeper</p>
          <div className="flex gap-4 bg-slate-700  rounded-lg">
            <Button
              onClick={() => {
                navigate("/borrow", { state: members });
              }}
              // sx={{ border: '2px solid black', backgroundColor:'#a78'}}
            >
              Borrow

            </Button>
            <Button
              onClick={() => {
                navigate("/return", { state: activeBorrows });
              }}
            >
              Return
            </Button>
            <Button
              color="secondary"
              className="font-medium "
              // sx={{ border: '2px solid black', backgroundColor:'#a78'}}
              onClick={() => {
                navigate("/pay", { state: activeDebts });
              }}
            >
              Pay
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-6 items-start ">
          <div className="w-full " >
            <p className="text-md font-medium text my-6 ">Borrowed Books</p>
            <Table aria-label="Borrowed Books Table" className="bg-slate-500 rounded-lg border-2">
              <TableHead>
                <TableRow className="bg-slate-700 rounded-lg border-2">
                  <TableCell>Book Title</TableCell>
                  <TableCell>User Name</TableCell>
                  <TableCell>Borrowed On</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeBorrows.map((item) => (
                  <TableRow key={item.username}>
                    <TableCell>{item.borrowed_title}</TableCell>
                    <TableCell>{item.username}</TableCell>
                    <TableCell>{item.borrowed_on}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="w-full">
            <p className="text-md font-medium my-6  ">Debts to clear</p>
            <Table aria-label="Debts Table" className="bg-slate-600 rounded-lg border-2">
              <TableHead>
                <TableRow >
                  <TableCell>User Name</TableCell>
                  <TableCell>Debt</TableCell>
                </TableRow>
              </TableHead>
              <TableBody >
                {activeDebts.map((item) => (
                  <TableRow key={item.username} className="bg-slate-500 rounded-lg ">
                    <TableCell>{item.username}</TableCell>
                    <TableCell>{item.debt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <p className="text-md font-medium ">Transactions Happened</p>
        <Table aria-label="Transactions Table" className="bg-slate-500 rounded-lg border-2">
          <TableHead >
            <TableRow className="border-2 bg-slate-600">
              <TableCell>User Name</TableCell>
              <TableCell>Book Title</TableCell>
              <TableCell>Borrowed On</TableCell>
              <TableCell>Returned On</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Rent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.username}</TableCell>
                <TableCell>{item.borrowed_title}</TableCell>
                <TableCell>{item.borrowed_on}</TableCell>
                <TableCell>{item.returned_on}</TableCell>
                <TableCell>{item.duration}</TableCell>
                <TableCell>{item.rent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default DashboardPage;
