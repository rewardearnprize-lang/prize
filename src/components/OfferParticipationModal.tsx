const SimpleTestModal = ({ isOpen, onClose }) => {
  const [value, setValue] = useState("");
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <h2>Test Modal</h2>
        <input 
          value={value} 
          onChange={(e) => setValue(e.target.value)} 
          placeholder="Type something..."
        />
        <button onClick={onClose}>Close</button>
        <button onClick={() => alert(value)}>Submit</button>
      </DialogContent>
    </Dialog>
  );
};
