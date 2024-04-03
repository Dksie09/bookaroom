"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    CaretSortIcon,
    ChevronDownIcon,
    DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
    flexRender,
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import EditBooking from './EditBooking';
import { Delete } from '@mui/icons-material';
import CancelBooking from './CancelBooking';

function BookingTable({ refreshKey, onEditBooking }) {
    const [bookings, setBookings] = useState([]);
    const [editedData, setEditedData] = useState({
        roomId: "",
        userEmail: "",
        startTime: "",
        endTime: "",
        price: 0,
        status: "active"
    });

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get('/api/allBookings');
                console.log(response.data);
                setBookings(response.data);
            } catch (error) {
                console.error('Failed to fetch bookings:', error);
            }
        };

        fetchBookings();
    }, [refreshKey]);


    const columns = React.useMemo(() => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'roomId',
            header: () => <div>Room No.</div>,
            cell: ({ row }) => { return <div>{row.getValue("roomId")}</div> },
        },
        {
            accessorKey: 'userEmail',
            header: () => <div>Guest Email</div>,
            cell: ({ row }) => { return <div className="lowercase">{row.getValue("userEmail")}</div> },
        },
        {
            accessorKey: 'startTime',
            header: () => <div>Start Time</div>,
            cell: ({ row }) => { return <div>{new Date(row.getValue("startTime")).toLocaleString()}</div> },
        },
        {
            accessorKey: 'endTime',
            header: () => <div>End Time</div>,
            cell: ({ row }) => { return <div>{new Date(row.getValue("endTime")).toLocaleString()}</div> },
        },
        {
            accessorKey: 'price',

            header: () => <div>Price</div>,
            cell: ({ row }) => {
                return row.original.status === "cancelled" ? <div>-</div> : <div>${row.getValue("price")}</div>;
            }
        },
        {
            accessorKey: 'status',
            header: () => <div>Status</div>,
            cell: ({ row }) => { return <div className="capitalize">{row.getValue("status")}</div> },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const booking = row.original;

                return (
                    <>
                        {/* <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => console.log(row.original)}>
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button> */}
                        {/* {console.log(row.original._id)} */}
                        <EditBooking bookingID={row.original._id} onNewBooking={onEditBooking} currentBooking={row.original} />
                    </>
                )
            },
            enableHiding: false,
        },
        {
            id: "delete",
            cell: ({ row }) => {
                const booking = row.original;

                return (
                    <div>
                        {row.original.status === "cancelled" ? (
                            <label className='text-sm font-medium text-red-500 bg-yellow-200'>Refund ₹{row.original.price}</label>
                        ) : (
                            <CancelBooking bookingID={row.original._id} onNewBooking={onEditBooking} currentBooking={row.original} />
                        )}
                    </div>
                );

            },
            enableHiding: false,
        }
    ], []);

    const table = useReactTable({
        data: bookings,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Find Room..."
                    value={table.getColumn('roomId')?.getFilterValue() ?? ''}
                    onChange={(event) =>
                        table.getColumn('roomId')?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                            >
                                {column.id}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    {/* <TableHead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHeader key={header.id} className="flex-grow flex-basis-0 whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHeader>

                                ))}
                            </TableRow>
                        ))}
                    </TableHead> */}

                    <TableBody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default BookingTable;
