'use client'

import EmployeeEditView from '@/components/EmployeeEditView';
import EmployeeView from '@/components/EmployeeView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Employee } from '@/lib/interfaces/interfaces';
import { getEmployeeById } from '@/lib/services/employee-service';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {
    const params = useParams();
    const raw = params.employeeId
    const employeeId = raw ? parseInt(raw as string) : 0;

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [token, setToken] = useState('');

    const [isEditing, setIsEditing] = useState(false);

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

       const getEmployee = async () => {
            if (token != '') {
                const tempEmployee = await getEmployeeById(token, employeeId);
                if (tempEmployee)
                    setEmployee(tempEmployee);
            }
        }

    useEffect(() => {

        if (token && employeeId) {
            getEmployee();
        }
    }, [token, employeeId])

    return (
        <div className="min-h-screen flex flex-col justify-center max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-black">
                        {employee ? employee.name : 'No employee found'}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 text-black">
                    {
                        employee && (
                            isEditing ?
                                <EmployeeEditView employee={employee} setEdit={setIsEditing} refreshEmployee={getEmployee} />
                                :
                                <EmployeeView employee={employee} setEdit={setIsEditing} />
                        )
                    }
                </CardContent>
            </Card>
        </div>
    )
}

export default page