import { IconHome, IconPlus } from "@tabler/icons-react";
import { Button } from "../button";
import { AddWidgetModal } from "../add-widget-modal";
import { useContext, useState } from "react";
import { GridLayoutsContext } from "../../context";
import { TWidgetWithMetadata } from "../../types";
import { useNavigate } from "react-router";

const GridControls = () => {
  const { addGridLayout } = useContext(GridLayoutsContext);
  const [showAddWidgetModal, setShowAddWidgetModal] = useState(false);
  const navigate = useNavigate();

  const handleSave = (widget: TWidgetWithMetadata) => {
    addGridLayout({
      i: widget.id,
      x: 0,
      y: 0,
      w: 4,
      h: 4,
      widget,
    });
    setShowAddWidgetModal(false);
  };

  return (
    <>
      <div className="left-0 top-0 m-4 fixed z-10">
        <Button onClick={() => navigate("/")}>
          <IconHome className="w-4 h-4 cursor-pointer text-white" />
        </Button>
      </div>
      <div className="right-0 bottom-0 m-4 fixed z-10">
        <Button onClick={() => setShowAddWidgetModal(true)}>
          <IconPlus className="w-4 h-4 cursor-pointer text-white" />
        </Button>
        <AddWidgetModal
          open={showAddWidgetModal}
          onClose={() => setShowAddWidgetModal(false)}
          onSave={handleSave}
        />
      </div>
    </>
  );
};

export { GridControls };
