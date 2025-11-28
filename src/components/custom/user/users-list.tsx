import { UserAvatar } from "@/components";
import { validateAuth } from "@/features/auth/services/auth.service";
import { getSpaceMembers } from "@/features/space/actions/get-space-members.action";
import { redirect } from "next/navigation";

export const Users = async () => {
  const auth = await validateAuth();
  if (!auth) {
    redirect("/sign-in");
  }

  const spaceMembers = await getSpaceMembers(auth.spaceId);

  return (
    <div className="overflow-auto sm:p-0 py-6">
      <div className="flex gap-2 sm:block flex-nowrap">
        <div className="flex gap-2 items-center justify-start btn btn-info p-1 mb-2">
          {spaceMembers.map(member => (
            <UserAvatar
              key={member.id}
              userName={member.name}
              title={member.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
