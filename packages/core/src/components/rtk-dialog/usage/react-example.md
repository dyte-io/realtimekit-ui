```jsx live
function Example() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div>
      <RtkButton onClick={() => setShowDialog(true)}>Show Dialog</RtkButton>
      <RtkDialog open={showDialog} onRtkDialogClose={() => setShowDialog(false)}>
        <div
          style={{
            width: '512px',
            backgroundColor: '#000',
            color: '#fff',
            padding: 12,
            borderRadius: 8,
          }}
        >
          <h3>Hello!</h3>
          <p style={{ marginBottom: 0 }}>This is some text inside dialog!</p>
        </div>
      </RtkDialog>
    </div>
  );
}
```
