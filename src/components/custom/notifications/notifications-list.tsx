import React from "react";
import { CustomTitle } from "../custom-title/custom-title";
import { NotificationsItem } from "@/components";

export const NotificationsList = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full p-4overflow-x-hidden">
      <CustomTitle title="All Notifications" tag="h2" />
      <div className="flex flex-col items-center justify-center">
        <NotificationsItem
          userName="John Doe"
          userImageUrl="https://via.placeholder.com/150"
          message="te invito a su grupo"
          badge="Grupo"
          date="15/01/2026"
          time="12:00"
        />
      </div>
    </div>
  );
};
