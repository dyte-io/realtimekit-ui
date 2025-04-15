```jsx live
function Example() {
  const [states, setStates] = useState({});

  const setState = (s) => setStates((states) => ({ ...states, ...s }));

  return (
    <Row>
      <RtkButton onClick={() => setState({ activeSettings: true })}>
        Show Settings
      </RtkButton>
      <RtkButton onClick={() => setState({ activeLeaveConfirmation: true })}>
        Show Leave Confirmation
      </RtkButton>
      <RtkButton
        onClick={() =>
          setState({
            activePermissionsMessage: { enabled: true, kind: 'audio' },
          })
        }
      >
        Show Permissions Troubleshooting UI
      </RtkButton>
      <RtkButton onClick={() => setState({ activeRemoteAccessManager: true })}>
        Show Remote Access Manager
      </RtkButton>
      <RtkDialogManager
        meeting={meeting}
        states={states}
        onRtkStateUpdate={(e) => setState(e.detail)}
      />
    </Row>
  );
}
```
