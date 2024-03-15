import { FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';

const searchColumns = [
  {
    key: 'title',
    label: 'Title',
  },
  {
    key: 'authors',
    label: 'Author',
  },
  {
    key: 'publisher',
    label: 'Publisher',
  },
  {
    key: 'isbn',
    label: 'ISBN',
  },
  {
    key: 'average_rating',
    label: 'Rating',
  },
  {
    key: 'num_pages',
    label: 'Pages',
  },
];

const BooksPage = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('title');
  const [searchResults, setSearchResults] = useState([]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setTitle('');
    setAuthor('');
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    if (filter === 'title') {
      setTitle(value);
    } else if (filter === 'authors') {
      setAuthor(value);
    }
  };

  useEffect(() => {
    axios
      .get('http://localhost:5000/searchbooks', {
        params: {
          title: title,
          page: page,
          author: author,
        },
      })
      .then((response) => {
        setSearchResults(response.data.message);
      })
      .catch((error) => {
        alert('Error fetching books', error);
      });
  }, [title, page, author]);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
        <FormControl className="bg-slate-600 rounded">
          <InputLabel id="filter-label"></InputLabel>
          <Select
            labelId="filter-label"
            id="filter"
            value={filter}
            onChange={handleFilterChange}
            
          >
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="authors">Authors</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Search"
          variant="outlined"
          onChange={handleSearch}
          value={filter === 'title' ? title : filter === 'authors' ? author : ''}
          className="bg-slate-600 rounded"
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
        />
      </div>
      <TableContainer>
        <Table aria-label="Books table" className="bg-slate-700 rounded">
          <TableHead>
            <TableRow >
              {searchColumns.map((column) => (
                <TableCell key={column.key} style={{ fontWeight: 'bold' }}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className="bg-slate-500 rounded-lg ">
            {searchResults.map((item) => (
              <TableRow key={item.bookID}>
                {searchColumns.map((column) => (
                  <TableCell key={column.key}>{item[column.key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default BooksPage;
