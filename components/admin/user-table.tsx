"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface UserTableProps {
  users: any[];
  onView?: (user: any) => void;
  onToggleStatus?: (user: any) => void;
}

export function UserTable({ users, onView, onToggleStatus }: UserTableProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleView = async (user: any) => {
    if (onView) {
      setLoading(user.id);
      await onView(user);
      setLoading(null);
    }
  };

  const handleToggleStatus = async (user: any) => {
    if (onToggleStatus) {
      setLoading(user.id);
      await onToggleStatus(user);
      setLoading(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    user.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    user.isAdmin
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }
                >
                  {user.isAdmin ? "Admin" : "User"}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={loading === user.id}
                    onClick={() => handleView(user)}
                  >
                    {loading === user.id ? "Loading..." : "View"}
                  </Button>
                  <Button
                    variant={user.isActive ? "destructive" : "default"}
                    size="sm"
                    disabled={loading === user.id}
                    onClick={() => handleToggleStatus(user)}
                  >
                    {loading === user.id
                      ? "Loading..."
                      : user.isActive
                      ? "Deactivate"
                      : "Activate"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
