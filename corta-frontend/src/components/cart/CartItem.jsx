function CartItem({ item, onRemove, onQuantityChange }) {
  const imagePath = `/${item.imageUrl}`;

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item.id, item.size, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(item.id, item.size, item.quantity + 1);
  };

  return (
    <div className="card mb-3">
      <div className="row g-0 align-items-center">
        <div className="col-md-2">
          <img src={imagePath} className="img-fluid rounded-start" alt={item.name} />
        </div>
        <div className="col-md-7">
          <div className="card-body">
            <h5 className="card-title">{item.name}</h5>
            
            {item.size && (
              <p className="card-text text-muted mb-1" style={{ fontSize: "14px" }}>
                Size: {item.size}
              </p>
            )}

            
            
            <p className="card-text fw-bold">
              Price: {item.price.toFixed(2)} €
            </p>

            <div className="d-flex align-items-center gap-2">
              <button 
                className="btn btn-sm btn-outline-secondary" 
                onClick={handleDecrease} 
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>Quantity: {item.quantity}</span>
              <button 
                className="btn btn-sm btn-outline-secondary" 
                onClick={handleIncrease}
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-3 text-end pe-3">
          <button 
            className="btn btn-danger"
            onClick={() => onRemove(item.id, item.size)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
