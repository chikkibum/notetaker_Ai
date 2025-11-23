"use client"
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, User, Calendar, Shield } from "lucide-react";

const UserDetails = () => {
  const user = useQuery(api.users.getUserDetails);

  if (!user) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>Your account information and profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.image} alt={user.name || "User"} />
              <AvatarFallback>{getInitials(user?.name! || user?.email!)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{user.name || "User"}</h3>
              {/* {user.role && (
                <Badge variant="secondary" className="mt-1">
                  {user.role}
                </Badge>
              )} */}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid gap-4">
            {/* Email */}
            <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
              <Mail className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{user.email}</p>
              </div>
            </div>

            {/* Username */}
            {user?.name && (
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Username</p>
                  <p className="text-sm">@{user?.name}</p>
                </div>
              </div>
            )}

            {/* Created Date */}
            {user?._creationTime && (
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                  <p className="text-sm">
                    {new Date(user?._creationTime).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Account Status */}
            {/* {user?. !== undefined && (
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                <Shield className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Account Status</p>
                  <Badge variant={user.isActive ? "default" : "destructive"} className="mt-1">
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            )} */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetails;