import React from "react";
import R from "ramda";
import { DragSource, DragDropContext, DropTarget } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

const COLUMN_WIDTH = 300;
const ROW_HEIGHT = 200;
const LABEL_HEIGHT = 50;
const LABEL_WIDTH = 100;
const NONE = "NONE";

//////////////////



const ItemTypes = { ITEM: "ITEM" };

const itemSource = {
  canDrag(props) {
    return props.canEdit;
  },
  beginDrag(props) {
    return {
      itemId: props.itemId,
      xAxisGroup: props.xAxisGroup,
      yAxisGroup: props.yAxisGroup,
      xAxisElement: props.xAxisElement,
      yAxisElement: props.yAxisElement
    };
  }
};

const dragCollect = (connect, monitor) => ({
  connectDragSource: connect.dragSource()
});

const cellTarget = {
  drop(props, monitor) {
    props.handleItemMove({
      itemId: monitor.getItem().itemId,
      xAxisGroup: props.xAxisGroup,
      yAxisGroup: props.yAxisGroup,
      xAxisElement: props.xAxisElement,
      yAxisElement: props.yAxisElement,
      oldxAxisElement: monitor.getItem().xAxisElement,
      oldyAxisElement: monitor.getItem().yAxisElement,
    });
  }
};

const dropCollect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget()
});

const wrapConnect = Item => ({ connectDragSource, ...props }) =>
  connectDragSource(
    <div>
      <Item {...props} />
    </div>
  );

const wrapDragSource = Item =>
  DragSource(ItemTypes.ITEM, itemSource, dragCollect)(Item);

const makeDnDItem = Item => wrapDragSource(wrapConnect(Item));

const GridCell = (
  {
    canEdit,
    xAxisGroup,
    yAxisGroup,
    xAxisElement,
    yAxisElement,
    cellItems,
    connectDropTarget
  }
) => {
  return connectDropTarget(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: COLUMN_WIDTH,
        minHeight: ROW_HEIGHT,
        boxSizing: "border-box",
        border: "solid",
        borderWidth: 1
      }}
    >
      {cellItems.map((cellItem, index) => {
        const {
          id,
          conditions,
          component,
          ...other
        } = cellItem
        const Item = component;
        const DnDItem = makeDnDItem(Item);
        return (
          <DnDItem
            canEdit={canEdit}
            xAxisGroup={xAxisGroup}
            yAxisGroup={yAxisGroup}
            xAxisElement={xAxisElement}
            yAxisElement={yAxisElement}
            itemId={id}
            itemConditions={conditions}
            {...other}
            key={index}
          />
        );
      })}
    </div>
  );
};

const GridCellAsDropTarget = DropTarget(
  ItemTypes.ITEM,
  cellTarget,
  dropCollect
)(GridCell);

////////////////////////////////////////////////////

const GridRow = React.createClass({
  componentDidMount: function() {
    let newHeight = this.rowRef.getBoundingClientRect().height;
    this.changeYLabelHeight(newHeight);
  },
  componentDidUpdate: function(prevProps, prevState) {
    let newHeight = this.rowRef.getBoundingClientRect().height;
    if (this.props.yLabelHeight !== newHeight) {
      this.changeYLabelHeight(newHeight);
    }
  },
  changeYLabelHeight: function(newHeight) {
    this.props.changeYLabelHeight(newHeight);
  },
  render: function() {
    const {
      canEdit,
      rowItems,
      xAxisGroup,
      yAxisGroup,
      xAxisElements,
      yAxisElement,
      handleItemMove
    } = this.props;
    let remainingItems = rowItems;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          minWidth: COLUMN_WIDTH
        }}
        ref={ref => this.rowRef = ref}
      >
        {xAxisElements.map(({ id }, index) => {
          let cellItems;
          const xAxisElement = id;
          const filterRemainingItems = func => R.filter(func, remainingItems);
          const hasXAxisElement = item =>
            item.conditions[xAxisGroup] === xAxisElement;
          if (xAxisElement !== NONE) {
            cellItems = filterRemainingItems(item => hasXAxisElement(item));
            remainingItems = filterRemainingItems(
              item => !hasXAxisElement(item)
            );
          } else {
            cellItems = remainingItems;
            remainingItems = [];
          }

          return (
            <GridCellAsDropTarget
              key={index}
              canEdit={canEdit}
              xAxisGroup={xAxisGroup}
              yAxisGroup={yAxisGroup}
              xAxisElement={xAxisElement}
              yAxisElement={yAxisElement}
              cellItems={cellItems}
              handleItemMove={handleItemMove}
            />
          );
        })}
      </div>
    );
  }
});

////////////////////////////////////////////////////

const SelectAxisBox = (
  {
    axisGroups,
    xAxisGroup,
    yAxisGroup,
    updateXAxisGroup,
    updateYAxisGroup
  }
) => {
  const axisKeys = axisGroups.map(axisGroupInfo => ({
    value: axisGroupInfo.id,
    children: axisGroupInfo.name
  }));
  const xAxisOptions = [...axisKeys, { value: NONE, children: NONE }];
  const yAxisOptions = [...axisKeys, { value: NONE, children: NONE }];
  const renderOptions = R.map(e => (
    <option key={e.value} value={e.value}>{e.children}</option>
  ));
  const updateXAxis = e => updateXAxisGroup(e.target.value);
  const updateYAxis = e => updateYAxisGroup(e.target.value);
  return (
    <div style={{ flex: 0, padding: 0 }}>
      <div>
        <select value={xAxisGroup} onChange={updateXAxis}>
          {renderOptions(xAxisOptions)}
        </select>
      </div>
      <div>
        <select value={yAxisGroup} onChange={updateYAxis}>
          {renderOptions(yAxisOptions)}
        </select>
      </div>

    </div>
  );
};

////////////////////////////////////////////////////

const X_AXIS_LABEL = "X_AXIS_LABEL";
const Y_AXIS_LABEL = "Y_AXIS_LABEL";
const GRID_CONTENT = "GRID_CONTENT";

const YAxisLabelCell = (
  {
    text,
    color = "white",
    backgroundColor = 'black',
    height,
    ...props
  }
) => {
  return (
    <div
      style={{
        backgroundColor: backgroundColor,
        color: color,
        width: "100%",
        height: height,
        minHeight: ROW_HEIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      {...props}
    >
      {text}
    </div>
  );
};

const XAxisLabelCell = (
  {
    text,
    color = "white",
    backgroundColor = 'black',
    ...props
  }
) => {
  return (
    <div
      style={{
        backgroundColor: backgroundColor,
        color: color,
        minWidth: COLUMN_WIDTH,
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

      }}
      {...props}
    >
      {text}
    </div>
  );
};

const UpperLeftCell = ({ children }) => {
  return (
    <div
      style={{
        flex: 0,
        minWidth: LABEL_WIDTH
      }}
    >
      {children}
    </div>
  );
};

const GridContentWrapper = ({ children, backgroundColor = 'white' }) => {
  return (
    <div
      id={GRID_CONTENT}
      style={{
        backgroundColor,
        flex: 1,
        overflow: "scroll"
      }}
    >
      {children}
    </div>
  );
};

const YAxisLabel = ({ children }) => {
  return (
    <div
      id={Y_AXIS_LABEL}
      style={{
        overflow: "hidden",
        flex: 0,
        minWidth: LABEL_WIDTH
      }}
    >

      {children}
    </div>
  );
};

const OtherRows = ({ children }) => (
  <div
    style={{
      overflow: "hidden",
      display: "flex",
      flex: 1,
    }}
  >
    {children}
  </div>
);


const XAxisLabel = ({ children }) => {
  return (
    <div
      id={X_AXIS_LABEL}
      style={{
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        flex: 1
      }}
    >
      {children}
    </div>
  );
};

const TopRow = ({ children }) => {
  return (
    <div
      style={{
        minHeight: LABEL_HEIGHT,
        flex: 0,
        display: "flex"
      }}
    >
      {children}
    </div>
  );
};

const GridWrapper = ({ children, gridWidth }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      overflow: "hidden",
      flexDirection: "column"
    }}
  >
    {children}
  </div>
);

function syncScrolls(e) {
  const headerRow = document.getElementById(X_AXIS_LABEL);
  const headerColumn = document.getElementById(Y_AXIS_LABEL);
  headerRow.scrollLeft = this.scrollLeft;
  headerColumn.scrollTop = this.scrollTop;
}

const GridLayout = React.createClass({
  getYLabelHeight: function(axisGroups, yAxisGroup) {
    const yAxisGroupInfo = R.find(R.propEq("id", yAxisGroup))(
      axisGroups
    );
    const numRows = R.length(R.pathOr([], ["elements"], yAxisGroupInfo));
    const yLabelHeights = R.times(() => ROW_HEIGHT, numRows);
    return yLabelHeights;
  },
  getInitialState: function() {
    return {
      yLabelHeights: this.getYLabelHeight(
        this.props.axisGroups,
        this.props.yAxisGroup
      )
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      yLabelHeights: this.getYLabelHeight(
        nextProps.axisGroups,
        nextProps.yAxisGroup
      )
    });
  },
  changeYLabelHeight: function(index, height) {
    let newYLabelHeights = this.state.yLabelHeights;
    newYLabelHeights[index] = height;
    this.setState({ yLabelHeights: newYLabelHeights });
  },
  componentDidMount: function() {
    const grid = document.getElementById(GRID_CONTENT);
    grid.addEventListener("scroll", syncScrolls);
  },
  componentWillUnmount: function() {
    const grid = document.getElementById(GRID_CONTENT);
    grid.removeEventListener("scroll", syncScrolls);
  },
  render: function() {
    const {
      canEdit,
      xAxisGroup,
      yAxisGroup,
      axisGroups,
      itemList,
      handleItemMove,
      updateXAxisGroup,
      updateYAxisGroup,
      backgroundColor
    } = this.props;


    // TODO: show if xAxisGroup && yAxisGroup
    const xAxisGroupInfo = R.find(R.propEq("id", xAxisGroup))(
      axisGroups
    );
    const yAxisGroupInfo = R.find(R.propEq("id", yAxisGroup))(
      axisGroups
    );
    const noneElement = { id: NONE, name: NONE, color: "white", backgroundColor: "#333" };
    const xAxisElementsLessNone = R.pathOr([], ["elements"], xAxisGroupInfo);
    const yAxisElementsLessNone = R.pathOr([], ["elements"], yAxisGroupInfo);
    const xAxisElements = !R.isEmpty(xAxisElementsLessNone)
      ? [...xAxisElementsLessNone, noneElement]
      : []
    const yAxisElements = !R.isEmpty(yAxisElementsLessNone)
      ? [...yAxisElementsLessNone, noneElement]
      : []
    const gridWidth = R.length(xAxisElements)*COLUMN_WIDTH
    let remainingItems = itemList;
    return (
      <GridWrapper gridWidth={gridWidth}>
        <TopRow>
          <UpperLeftCell>
            <SelectAxisBox
              axisGroups={axisGroups}
              xAxisGroup={xAxisGroup}
              yAxisGroup={yAxisGroup}
              updateXAxisGroup={updateXAxisGroup}
              updateYAxisGroup={updateYAxisGroup}
            />
          </UpperLeftCell>
          <XAxisLabel>
            {xAxisElements.map((element, index) => {
              return (
                <XAxisLabelCell
                  key={index}
                  text={element.name}
                  color={element.color}
                  backgroundColor={element.backgroundColor}
                />
              );
            })}
          </XAxisLabel>
        </TopRow>
        <OtherRows>
          <YAxisLabel>
            {yAxisElements.map((element, index) => {
              return (
                <YAxisLabelCell
                  key={index}
                  text={element.name}
                  color={element.color}
                  backgroundColor={element.backgroundColor}
                  height={this.state.yLabelHeights[index]}
                />
              );
            })}
          </YAxisLabel>
          <GridContentWrapper backgroundColor={backgroundColor}>
            {yAxisElements.map(({ id }, rowIndex) => {
              let rowItems;
              const yAxisElement = id;
              const filterRemainingItems = func =>
                R.filter(func, remainingItems);
              const hasYAxisElement = item =>
                item.conditions[yAxisGroup] === yAxisElement;
              if (yAxisElement !== NONE) {
                rowItems = filterRemainingItems(item => hasYAxisElement(item));
                remainingItems = filterRemainingItems(
                  item => !hasYAxisElement(item)
                );
              } else {
                rowItems = remainingItems;
                remainingItems = [];
              }
              return (
                <GridRow
                  key={rowIndex}
                  changeYLabelHeight={newHeight =>
                    this.changeYLabelHeight(rowIndex, newHeight)}
                  yLabelHeight={this.state.yLabelHeights[rowIndex]}
                  canEdit={canEdit}
                  rowItems={rowItems}
                  xAxisGroup={xAxisGroup}
                  yAxisGroup={yAxisGroup}
                  xAxisElements={xAxisElements}
                  yAxisElement={id}
                  handleItemMove={handleItemMove}
                />
              );
            })}
          </GridContentWrapper>
        </OtherRows>
      </GridWrapper>
    );
  }
});

//////////////////////////

const ParagraphCompWrapper = ({ children }) => (
  <div
    style={{
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }}
  >
    {children}
  </div>
);

const ParagraphWrapper = ({ children }) => (
  <div
    style={{
      margin: 40,
      flex: 1,
      overflow: "scroll"
    }}
  >
    {children}
  </div>
);

const OutsideWrapper = ({ children }) => (
  <div style={{flex: 1, width: '100%', overflowY: 'hidden'}}>
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </div>
  </div>


);

// comp needs to be class for refs imposed by DnD lib to work
const EmptyDiv = () => <div></div>

class Grid extends React.Component {
  render() {
    const {
      canEdit,
      axisGroups,
      itemList,
      xAxisGroup,
      yAxisGroup,
      handleItemMove,
      updateXAxisGroup,
      updateYAxisGroup,
      placeholderComp,
      backgroundColor
    } = this.props;
    const PlaceholderComp = placeholderComp !== undefined ? placeholderComp : EmptyDiv;
    if (xAxisGroup !== NONE && yAxisGroup !== NONE) {
      return (
        <OutsideWrapper>
          <GridLayout
            canEdit={canEdit}
            xAxisGroup={xAxisGroup}
            yAxisGroup={yAxisGroup}
            axisGroups={axisGroups}
            itemList={itemList}
            handleItemMove={handleItemMove}
            updateXAxisGroup={updateXAxisGroup}
            updateYAxisGroup={updateYAxisGroup}
            backgroundColor={backgroundColor}
          />
        </OutsideWrapper>
      );
    } else {
      return (
        <OutsideWrapper>
          <ParagraphCompWrapper>
            <SelectAxisBox
              axisGroups={axisGroups}
              xAxisGroup={xAxisGroup}
              yAxisGroup={yAxisGroup}
              updateXAxisGroup={updateXAxisGroup}
              updateYAxisGroup={updateYAxisGroup}
            />
            <ParagraphWrapper>
              <PlaceholderComp />
            </ParagraphWrapper>
          </ParagraphCompWrapper>
        </OutsideWrapper>
      );
    }
  }
}

const DnDGrid = R.compose(DragDropContext(HTML5Backend))(Grid);

export default DnDGrid;
