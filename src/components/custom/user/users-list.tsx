import { UserAvatar } from "@/components/custom/user/user-avatar";
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
    <div className="sm:p-0 py-6">
      <div className="flex gap-2 p-1 sm:flex-col overflow-x-auto">
        {spaceMembers.map((member) => (
          <div key={member.id} className="btn btn-info p-1">
            <UserAvatar
              userName={member.name}
              imageUrl={member.imageUrl || undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
