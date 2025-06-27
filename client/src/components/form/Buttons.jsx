import { RotateCw } from "lucide-react";
import { Button } from "../ui/button";

function Buttons({ text, isPending, type }) {
  return (
    <Button type={type}>
      {isPending ? (
        <>
          <RotateCw className="animate-spin" />
          <span>Please Wait...</span>
        </>
      ) : (
        <p className="capitalize">{text}</p>
      )}
    </Button>
  );
}
export default Buttons;
