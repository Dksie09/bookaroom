"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from 'date-fns';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    flexRender,
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import EditBooking from './EditBooking';
import { CancelRounded, Delete, RemoveCircle, SwapVert, } from '@mui/icons-material';
import CancelBooking from './CancelBooking';
import { CalendarIcon } from '@mui/x-date-pickers';


function BookingTable({ refreshKey, bookings, onEditBooking, roomData, roomCostData }) {

    const [roomTypeFilter, setRoomTypeFilter] = useState("none");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const getRoomTypeById = (roomId) => {
        const room = roomData.find((room) => room.roomNumber === roomId);
        return room ? room.typeId : null;
    };

    const RoomTypeFilter = () => {
        return (
            <Select value={roomTypeFilter} onValueChange={setRoomTypeFilter}>
                <SelectTrigger className="w-[180px] ml-2">
                    <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Room Type</SelectLabel>
                        <SelectItem value="none">All</SelectItem>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        );
    };

    const filteredBookings = React.useMemo(() => {
        return bookings.filter((booking) => {
            const roomTypeMatch = roomTypeFilter === "none" || getRoomTypeById(booking.roomId) === roomTypeFilter;
            const bookingStartTime = new Date(booking.startTime);
            const isAfterStartDate = startDate ? bookingStartTime >= startDate : true;
            const isBeforeEndDate = endDate ? bookingStartTime <= endDate : true;
            return roomTypeMatch && isAfterStartDate && isBeforeEndDate;
        });
    }, [bookings, roomTypeFilter, roomData, startDate, endDate]);


    function DatePicker({ date, setDate, label }) {
        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-2/5 justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>{label}</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
            </Popover>
        );
    }

    function removeAllFilters() {
        setEndDate(null)
        setStartDate(null)
        setRoomTypeFilter("none")
    }


    const columns = React.useMemo(() => [

        {
            accessorKey: 'status',
            header: () => <div>Status</div>,
            cell: ({ row }) => {
                const status = row.getValue("status");
                const textColor = status === "cancelled" ? "text-red-300" : "text-green-500";
                return <div className={`capitalize ${textColor}`}>{status}</div>;
            }

        },
        {
            accessorKey: 'roomId',
            header: ({ column }) => {
                return (<Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Room no.
                    <SwapVert className="ml-2 h-4 w-4" />
                </Button>)
            },
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
            cell: ({ row }) => {
                const startTime = new Date(row.getValue("startTime"));
                return <div>{format(startTime, "MMM dd, yyyy HH:mm")}</div>;
            },
        },
        {
            accessorKey: 'endTime',
            header: () => <div>End Time</div>,
            cell: ({ row }) => {
                const endTime = new Date(row.getValue("endTime"));
                return <div>{format(endTime, "MMM dd, yyyy HH:mm")}</div>;
            },
        },

        {
            accessorKey: 'price',

            header: () => <div>Price</div>,
            cell: ({ row }) => {
                return row.original.status === "cancelled" ? <div>-</div> :
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                        ₹{row.getValue("price")}
                    </code>
                    ;
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const booking = row.original;

                return (

                    row.original.status === "cancelled" ? <Button disabled>Edit</Button> :
                        <EditBooking bookingID={row.original._id} onNewBooking={onEditBooking} currentBooking={row.original} />

                )
            },
            enableHiding: false,
        }, {
            id: "delete",
            cell: ({ row }) => {
                const booking = row.original;

                return (
                    <div>
                        {row.original.status === "cancelled" ? (
                            // <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                            <p className="text-sm text-muted-foreground">Refund ₹{row.original.price}</p>

                        ) : (
                            <CancelBooking bookingID={row.original._id} onNewBooking={onEditBooking} currentBooking={row.original} />
                        )}
                    </div>
                );

            },
            enableHiding: false,
        }
        ,


    ], []);

    const table = useReactTable({
        data: filteredBookings,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="w-full">
            <div className="flex items-center py-4 flex-wrap">
                <Input
                    placeholder="Find Room..."
                    value={table.getColumn('roomId')?.getFilterValue() ?? ''}
                    onChange={(event) =>
                        table.getColumn('roomId')?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <RoomTypeFilter />
                <div className="flex items-center gap-2 py-2 ml-auto">
                    <DatePicker date={startDate} setDate={setStartDate} label="Start date" />
                    <DatePicker date={endDate} setDate={setEndDate} label="End date" />
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline text-red-500" size="icon" onClick={removeAllFilters} >
                                    <CancelRounded className=" w-full" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Remove all filters</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>


            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

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
