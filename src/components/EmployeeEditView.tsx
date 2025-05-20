'use client'

import { Employee } from '@/lib/interfaces/interfaces'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon, Calendar } from 'lucide-react'
import { addEmployee, updateEmployee } from '@/lib/services/employee-service'

const EmployeeEditView = ({ employee, setEdit }: { employee: Employee, setEdit: (value: boolean) => void }) => {


 const allowedTitles = ['Customer Support', 'IT Support Specialist', 'Software Engineer']

    // useStates
    const [employeeToChange, setEmployeeToChange] = useState<Employee>({
        id: 0,
        name: "",
        jobTitle: "",
        hireDate: "",
        details: "",
        status: ""
    });

    const [token, setToken] = useState('');

    const disableBtn =
        employeeToChange.name.trim() == "" ||
        employeeToChange.jobTitle.trim() == "" || 
        employeeToChange.hireDate == "" ||
        !allowedTitles.includes(employeeToChange.jobTitle) 
        

    // Change employee functions
    const handleEmployeeToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmployeeToChange({
            ...employeeToChange,
            [e.target.id]: e.target.value,
        });
    };

      const handleEmployeeToChangeTitle = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEmployeeToChange({
            ...employeeToChange,
            [e.target.id]: e.target.value,
        });
    };

    const handleEmployeeToChangeHireDate = (date: string) => {
        setEmployeeToChange({
            ...employeeToChange,
            hireDate: date,
        });
    };

    // Date functions
    const formatDateForInput = (date: string) => {
        if (!date) return undefined;

        const [year, month, day] = date.toString().split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    const formatDateFromInput = (date: Date | undefined) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    // Add & Edit function
    const handleEmployee = async () => {
        try {
            const employeeWithChanges = {
                ...employeeToChange,
                name: employeeToChange.name.trim(),
                jobTitle: employeeToChange.jobTitle.trim(),
            };

       
                if (await updateEmployee(token, employeeWithChanges)) {
                    await refreshEmployees();
                }
            

            setEmployeeToChange({
                id: 0,
                name: "",
                jobTitle: "",
                hireDate: "",
                details: "",
                status: ""
            });
        } catch (error) {
            console.log("error", error);
        }

    };

    useEffect(() => {
        const handleToken = async () => {
            if (localStorage.getItem('user')) {
                setToken(await JSON.parse(localStorage.getItem('user')!).token);
            }
            if (sessionStorage.getItem('user')) {
                setToken(await JSON.parse(sessionStorage.getItem('user')!).token);
            }
        }

        handleToken();
    }, []);



    return (
        <>
            <div>
                <p className="text-sm font-semibold">Job Title</p>
                <Input value={employee.jobTitle} />
            </div>

            <div>
                <p className="text-sm font-semibold">Details</p>
                <Input value={employee.details || ""} />
            </div>

            <div>
                <p className="text-sm font-semibold">Status</p>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Sick">Sick</SelectItem>
                            <SelectItem value="Out of Office">Out of Office</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <p className="text-sm font-semibold">Hire Date</p>
                <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn("w-full justify-start text-left font-normal text-muted-foreground")}
                                >
                                    <CalendarIcon />
                                    <span>Pick a date</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    // selected={new Date(employee.hireDate).toLocaleDateString()}
                                    
                                />
                            </PopoverContent>
                        </Popover>
            </div>


            <div className="flex justify-between pt-4">
                <Button onClick={() => setEdit(false)}>Cancel</Button>
                {employee && <Button variant="outline">Save Edits</Button>}
            </div>
        </>
    )
}

export default EmployeeEditView

function refreshEmployees() {
    throw new Error('Function not implemented.')
}
