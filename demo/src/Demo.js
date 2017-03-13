import React, { Component } from "react";
import DnDGrid from '../../src'
import R from "ramda";
/**
const itemListing = [
  {
    id: xxxx,
    conditions: {
      axisGroup2Id: axisElement1Id
    }
    component: xxxx
  },
  ...
]

const axisGroupDescriptions = [
  {
    id: axisGroup1Id,
    name: axisGroup1Name,
    elements: [
      {
        id: axisElement1Id,
        name: axisElement1Name,
        color: axisElement1Color,
        backgroundColor: axisElement1BackgroundColor
      },
      ...
    ],
  },
  ...
]
*/

const shadow = "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)";

const ItemWrapper = (
  {
    children,
    onClick
  }
) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        boxShadow: shadow,
        fontSize: 12,
        margin: 5,
        padding: 5,
        borderRadius: 3,
        width: 278
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const ElementList = (
  {
    children
  }
) => {
  return <div
      style={{
        flex: 1,
        display: "flex",
        flexWrap: "wrap",
        overflowY: "scroll",
        alignContent: "flex-start"
      }}
    >{children}</div>;
};

const ItemElement = (
  {
    children
  }
) => {
  return <div
      style={{
        display: "flex",
        margin: "2px 4px"
      }}
    >{children}</div>;
};

const Item = (
  {
    itemId,
    itemConditions,
    ...props
  }
) => {
  if (itemInfo[itemId] !== undefined) {
    return (
      <ItemWrapper onClick={() => console.log(`Item ${itemId} was clicked`)}>
        <div style={{ fontSize: 14 }}>
          {itemInfo[itemId].description}
        </div>
        <div style={{ height: 2 }} />
        <ElementList>
          {R.values(
            R.mapObjIndexed(
              (elementId, axisGroupId) => {
                const axisGroup = R.find(
                  R.propEq("id", axisGroupId),
                  axisGroups
                );
                const axisGroupName = axisGroup.name;
                const elementInfo = R.find(
                  R.propEq("id", elementId),
                  axisGroup.elements
                );
                const elementName = elementInfo.name;
                return (
                  <ItemElement key={axisGroupId}>
                    {`${axisGroupName}: ${elementName},`}
                  </ItemElement>
                );
              },
              itemConditions
            )
          )}
        </ElementList>
      </ItemWrapper>
    );
  } else {
    return <div />;
  }
};

const axisGroups = [
  {
    id: "aAxisGroup",
    name: "Priority",
    elements: [
      {
        id: "bElement",
        name: "1",
        backgroundColor: "#f44336",
        color: "white"
      },
      {
        id: "cElement",
        name: "2",
        backgroundColor: "#ff9800",
        color: "black"
      },
      {
        id: "dElement",
        name: "3",
        backgroundColor: "#3f51b5",
        color: "white"
      }
    ]
  },
  {
    id: "eAxisGroup",
    name: "Status",
    elements: [
      {
        id: "fElement",
        name: "Todo",
        backgroundColor: "#ffc107",
        color: "black"
      },
      {
        id: "gElement",
        name: "In Progress",
        backgroundColor: "#009688",
        color: "black"
      },
      {
        id: "hElement",
        name: "Done",
        backgroundColor: "#673ab7",
        color: "white"
      }
    ]
  },
  {
    id: "iAxisGroup",
    name: "Excitement",
    elements: [
      {
        id: "jElement",
        name: "Yes!",
        backgroundColor: "#e91e63",
        color: "white"
      },
      {
        id: "kElement",
        name: "Okay",
        backgroundColor: "#00bcd4",
        color: "black"
      },
      {
        id: "lElement",
        name: "Meh",
        backgroundColor: "#607d8b",
        color: "white"
      }
    ]
  }
];

const initialItemList = [
  {
    id: "mItem",
    conditions: {
      aAxisGroup: "bElement",
      eAxisGroup: "fElement"
    },
    component: Item
  },
  {
    id: "nItem",
    conditions: {
      aAxisGroup: "bElement",
      eAxisGroup: "gElement",
      iAxisGroup: "lElement"
    },
    component: Item
  },
  {
    id: "oItem",
    conditions: {
      aAxisGroup: "cElement",
      eAxisGroup: "gElement",
      iAxisGroup: "kElement"
    },
    component: Item
  },
  {
    id: "pItem",
    conditions: {
      aAxisGroup: "bElement",
      eAxisGroup: "fElement",
      iAxisGroup: "jElement"
    },
    component: Item
  },
  {
    id: "qItem",
    conditions: {
      aAxisGroup: "dElement",
      eAxisGroup: "fElement",
      iAxisGroup: "lElement"
    },
    component: Item
  },
  {
    id: "rItem",
    conditions: {
      aAxisGroup: "dElement",
      eAxisGroup: "fElement",
      iAxisGroup: "jElement"
    },
    component: Item
  },
  {
    id: "sItem",
    conditions: {
      aAxisGroup: "dElement",
      eAxisGroup: "fElement",
      iAxisGroup: "lElement"
    },
    component: Item
  },
  {
    id: "tItem",
    conditions: {
      aAxisGroup: "dElement",
      eAxisGroup: "fElement",
      iAxisGroup: "lElement"
    },
    component: Item
  }
];

const itemInfo = {
  mItem: {
    description: "Plant the seeds"
  },
  nItem: {
    description: "Pick the weeds"
  },
  oItem: {
    description: "Till the ground"
  },
  pItem: {
    description: "Water"
  },
  qItem: {
    description: "Release the ladybugs"
  },
  rItem: {
    description: "Harvest"
  },
  sItem: {
    description: "Eat"
  },
  tItem: {
    description: "Get the tools"
  }
};

class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canEdit: true,
      axisGroups: axisGroups,
      itemList: initialItemList,
      xAxisGroup: "eAxisGroup",
      yAxisGroup: "iAxisGroup"
    };
  }
  handleItemMove = (
    {
      itemId,
      xAxisGroup,
      yAxisGroup,
      xAxisElement,
      yAxisElement,
      oldxAxisElement,
      oldyAxisElement
    }
  ) => {
    const oldItemList = this.state.itemList;
    const affectedItemIndex = R.findIndex(R.propEq("id", itemId))(oldItemList);
    const affectedItem = oldItemList[affectedItemIndex];
    const newConditions = {
      ...affectedItem.conditions,
      [xAxisGroup]: xAxisElement,
      [yAxisGroup]: yAxisElement
    };
    const newConditionsLessNones = xAxisElement === "NONE"
      ? yAxisElement === "NONE"
          ? R.omit([xAxisGroup, yAxisGroup], newConditions)
          : R.omit([xAxisGroup], newConditions)
      : yAxisElement === "NONE"
          ? R.omit([yAxisGroup], newConditions)
          : newConditions;

    const newItem = {
      ...affectedItem,
      conditions: newConditionsLessNones
    };
    const newItemList = R.update(affectedItemIndex, newItem, oldItemList);
    this.setState({ itemList: newItemList });
  };
  updateXAxisGroup = newAxisGroup => {
    this.setState({ xAxisGroup: newAxisGroup });
  };
  updateYAxisGroup = newAxisGroup => {
    this.setState({ yAxisGroup: newAxisGroup });
  };
  toggleCanEdit = () => {
    this.setState({ canEdit: !this.state.canEdit });
  };
  render() {
    return (
      <div
        style={{
          maxWidth: 1000,
          width: "100vw",
          maxHeight: 600,
          height: "100vh",
          display: "flex",
          margin: 16,
          flexDirection: "column"
        }}
      >
        <div>
          <div style={{ fontSize: 48, paddingLeft: 16 }}>
            {"dnd-grid demo"}
          </div>
          <button onClick={this.toggleCanEdit} style={{ margin: 16 }}>
            {this.state.canEdit
              ? "Make Items Undraggable"
              : "Make Items Draggable"}
          </button>
        </div>
        <DnDGrid
          canEdit={this.state.canEdit}
          axisGroups={this.state.axisGroups}
          itemList={this.state.itemList}
          xAxisGroup={this.state.xAxisGroup}
          yAxisGroup={this.state.yAxisGroup}
          handleItemMove={this.handleItemMove}
          updateXAxisGroup={this.updateXAxisGroup}
          updateYAxisGroup={this.updateYAxisGroup}
          backgroundColor={"#e0e0e0"}
        />
      </div>
    );
  }
}

export default Demo;
