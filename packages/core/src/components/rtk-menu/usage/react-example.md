```jsx live
<Row style={{ padding: '52px 0 0 0' }}>
  <RtkMenu placement="top">
    <RtkButton slot="trigger">Top Menu</RtkButton>
    <RtkMenuList>
      <RtkMenuItem onClick={() => alert('You clicked: alert()')}>
        alert()
      </RtkMenuItem>
    </RtkMenuList>
  </RtkMenu>

  {/* This menu will be placed at top due to less space */}
  <RtkMenu placement="bottom">
    <RtkButton slot="trigger">Bottom Menu</RtkButton>
    <RtkMenuList>
      <RtkMenuItem onClick={() => alert('You clicked: alert()')}>
        alert()
      </RtkMenuItem>
    </RtkMenuList>
  </RtkMenu>
</Row>
```
