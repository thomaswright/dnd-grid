# dnd-grid

<!-- [![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls] -->

Check out the [demo](http://dnd-grid.surge.sh/). **dnd-grid** is a react component that renders a scrollable grid with items sorted into and draggable between cells; axes are easily changable.


## Install

```js
npm install dnd-grid
```

## Use

```js
const SomeComponent = ({...}) => {
  ...
  const result = (
    <div>
      ...
      <DnDGrid
        canEdit={bool}
        axisGroups={array, see outline below or example in demo}
        itemList={array, see outline below or example in demo}
        xAxisGroup={string, axisGroupId}
        yAxisGroup={string, axisGroupId}
        handleItemMove={({
          itemId, // string, itemId
          xAxisGroup, // string, axisGroupId
          yAxisGroup, // string, axisGroupId
          xAxisElement, // string, axisElementId
          yAxisElement, // string, axisElementId
          oldxAxisElement, // string, axisElementId
          oldyAxisElement // string, axisElementId
        }) => {...}}
        updateXAxisGroup={(stringOfNewGroupId) => {...}}
        updateYAxisGroup={(stringOfNewGroupId) => {...}}
        backgroundColor={string, color}
      />
    </div>
  )
  return result
}

const axisGroups = [
  {
    id: axisGroupId,
    name: axisGroupName,
    elements: [
      {
        id: axisElementId,
        name: axisElementName,
        color: axisElementColor,
        backgroundColor: axisElementBackgroundColor
      },
      // ... other axis elements
    ],
  },
  // ... other axis groups
]

const itemList = [
  {
    id: itemId,
    conditions: {
      [axisGroupId]: axisElementId ,
      // ... other item conditions
    },
    component: ({itemId, itemConditions, ...other}) => {...}
  },
  // ... other items
]
```



<!-- [build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo -->
