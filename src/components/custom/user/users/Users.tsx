import { UserAvatar } from "@/components";

export const Users = () => {
  return (
    <div className=" overflow-auto sm:p-0 py-6">
      {/* users  */}

      <div className="flex gap-2 sm:block flex-nowrap">
        {/* user */}
        <div className="flex gap-2 items-center justify-start btn btn-info p-1 mb-2">
          <UserAvatar userName="Gonzalo" title="Gonzalo" />
        </div>
        {/* user 2 */}
        <div className="flex gap-2 items-center justify-start p-1 btn mb-2">
          <UserAvatar userName="Gabriela" title="Gabriela" />
        </div>
      </div>
    </div>
  );
};
