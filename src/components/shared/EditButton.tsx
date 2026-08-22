
import { useUserContext } from "@/context/AuthContext";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

type EditButtonProps = {
  targetUserId: string;
  size?: "default" | "sm";
};

const EditButton = ({ targetUserId, size = "default"} : EditButtonProps) => {
    const { user } = useUserContext();
    const userId = user.id;
    const navigate = useNavigate();
    if(!userId || userId !== targetUserId) return null;
    return (
        <div>
        <Button onClick={() => navigate(`/update-profile/`)} className="bg-primary-500 text-light-1 hover:bg-primary-500">
            Edit Profile
        </Button>
        </div>
    )
};

export default EditButton;