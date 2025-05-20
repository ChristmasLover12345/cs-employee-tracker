"use client";

import { Employee } from "@/lib/interfaces/interfaces";
import { deleteEmployee, getEmployees } from "@/lib/services/employee-service";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { Button } from "./ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
  TableFooter,
} from "./ui/table";
import EmployeeModal from "./EmployeeModal";
import { useAppContext } from '@/lib/context/context';

const EmployeeTable = () => {
  const { push } = useRouter();

    const { setEmployeeId } = useAppContext();

  // useStates
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [sortedEmployees, setSortedEmployees] = useState<Employee[]>([]);

  const [token, setToken] = useState("");

  const [sortBy, setSortBy] = useState("");
  const [sortByJob, setSortByJob] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [totalPages, setTotalPages] = useState(0);

  const [paginatedEmployees, setPaginatedEmployees] = useState<Employee[]>([]);

  // Pagination Logic

  // Functions to handle page change
  const NextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const PreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // function for slicing employees
  useEffect(() => {
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    setPaginatedEmployees(sortedEmployees.slice(start, end));
  }, [sortedEmployees, page, pageSize]);

  // Function to get employees
  const handleGetEmployees = async () => {
    try {
      const result: Employee[] | "Not Authorized" = await getEmployees(token);
      // const result: Employee[] | "Not Authorized" = [];
      if (result.toString() === "Not Authorized") {
        localStorage.setItem("Not Authorized", "true");
        push("/login");
      }

      setEmployees(result as Employee[]);
    } catch (error) {
      console.log("error", error);
    }
  };

  
    const handleViewEmployee = async (id: number) => {
        await setEmployeeId(id);

        push('/employee-page');
    };

  // Updating sort functions
  const changeSortBy = (value: string) => {
    if (value == "name") {
      setSortBy(`${value}`);
    } else if (value == "name-reverse") {
      setSortBy(`${value}`);
    } else if (value == "hire-date") {
      setSortBy(`${value}`);
    } else if (value == "hire-date-reverse") {
      setSortBy(`${value}`);
    } else {
      setSortBy("name");
    }

    if (sortByJob) {
      setSortByJob("");
    }
  };

  const changeSortByJob = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy("job-title");

    setSortByJob(e.target.value);
  };

  // Delete employee
  const handleDeleteEmployee = async (id: number) => {
    try {
      if (await deleteEmployee(token, id)) {
        await handleGetEmployees();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // Getting the user token from storage
  useEffect(() => {
    const handleToken = async () => {
      if (localStorage.getItem("user")) {
        setToken(await JSON.parse(localStorage.getItem("user")!).token);
      }
      if (sessionStorage.getItem("user")) {
        setToken(await JSON.parse(sessionStorage.getItem("user")!).token);
      }
    };

    handleToken();
  }, []);

  // Fetching employees after token is set
  useEffect(() => {
    if (token !== "") {
      handleGetEmployees();
    }
  }, [token]);

  // Sorting the employees
  useEffect(() => {
    let sortingEmployees = [...employees];

    const handleSorting = () => {
      switch (sortBy) {
        case "name":
          sortingEmployees.sort((a: Employee, b: Employee) =>
            a.name.localeCompare(b.name)
          );
          break;
        case "name-reverse":
          sortingEmployees.sort((a: Employee, b: Employee) =>
            b.name.localeCompare(a.name)
          );
          break;
        case "hire-date":
          sortingEmployees.sort(
            (a: Employee, b: Employee) =>
              Number(new Date(b.hireDate)) - Number(new Date(a.hireDate))
          );
          break;
        case "hire-date-reverse":
          sortingEmployees.sort(
            (a: Employee, b: Employee) =>
              Number(new Date(a.hireDate)) - Number(new Date(b.hireDate))
          );
          break;
        case "job-title":
          sortingEmployees = sortingEmployees.filter(
            (employee: Employee) => employee.jobTitle == sortByJob
          );
          break;
        default:
          sortingEmployees.sort((a: Employee, b: Employee) => a.id - b.id);
          break;
      }
      setSortedEmployees(sortingEmployees);
      setTotalPages(Math.ceil(sortingEmployees.length / pageSize));

      setPaginatedEmployees(
        sortingEmployees.slice((page - 1) * pageSize, page * pageSize)
      );
    };

    handleSorting();
  }, [employees, sortBy, sortByJob]);

  return (
    <>
      {/* Sort by - Start */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-4">
        <div className="flex items-center gap-3 mb-2 md:mb-0">
          <h2 className="text-2xl font-medium text-gray-700 dark:text-white">
            Add new hire
          </h2>
          <EmployeeModal
            type="Add"
            employee={null}
            refreshEmployees={handleGetEmployees}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center">
            <p className="mr-2 text-sm text-gray-600">Sort by:</p>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  Name
                  {sortBy === "name" ? (
                    <FaCaretDown className="ml-2" />
                  ) : sortBy === "name-reverse" ? (
                    <FaCaretUp className="ml-2" />
                  ) : (
                    ""
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => changeSortBy("name")}
                >
                  A-Z
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => changeSortBy("name-reverse")}
                >
                  Z-A
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  Hire date
                  {sortBy === "hire-date" ? (
                    <FaCaretDown className="ml-2" />
                  ) : sortBy === "hire-date-reverse" ? (
                    <FaCaretUp className="ml-2" />
                  ) : (
                    ""
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => changeSortBy("hire-date")}
                >
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => changeSortBy("hire-date-reverse")}
                >
                  Oldest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="cursor-pointer">
              <select
                className="ml-3 text-sm border rounded p-1 cursor-pointer"
                value={sortBy === "job-title" ? sortByJob : ""}
                onChange={(e) => changeSortByJob(e)}
              >
                <option value="" disabled>
                  Job title
                </option>
                <option value="Customer Support">Customer Support</option>
                <option value="IT Support Specialist">
                  IT Support Specialist
                </option>
                <option value="Software Engineer">Software Engineer</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Sort by - End */}

      {/* Display table - Start */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg">Employee name</TableHead>
            <TableHead className="text-lg">Job Title</TableHead>
            <TableHead className="text-lg">Date Hired</TableHead>
            <TableHead className="text-lg text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedEmployees.length === 0 ? (
            <TableRow>
              <TableCell></TableCell>
              <TableCell className="text-center">No Employees</TableCell>
              <TableCell></TableCell>
            </TableRow>
          ) : (
            paginatedEmployees.map((employee, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.jobTitle}</TableCell>
                <TableCell>{employee.hireDate}</TableCell>
                <TableCell className="flex gap-3 justify-end">
                    <Button onClick={() => handleViewEmployee(employee.id)}>
                                        View
                    </Button>
                  <EmployeeModal
                    type="Edit"
                    employee={employee}
                    refreshEmployees={handleGetEmployees}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteEmployee(employee.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {/* Display table - End */}
      <div className="w-full flex justify-between items-center mt-4">
        <Button onClick={PreviousPage} disabled={page <= 1}>
          Previous
        </Button>
        <h2>{`${page} out of ${totalPages}`}</h2>
        <Button onClick={NextPage} disabled={page >= totalPages}>
          Next
        </Button>
      </div>
    </>
  );
};

export default EmployeeTable;
