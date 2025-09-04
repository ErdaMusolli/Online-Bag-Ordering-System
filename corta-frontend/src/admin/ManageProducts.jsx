import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../services/authFetch';
import { getNewAccessToken } from '../services/tokenUtils';

const ManageProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', oldPrice:null, description: '', stock: '', image: null, additionalImages: [], existingImages: [] });
  const [newProduct, setNewProduct] = useState({ name: '', price: '', oldPrice:null, description: '', stock: '', image: null, additionalImages: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token') || await getNewAccessToken();
      if (!token) return navigate('/login');
      try {
        const res = await authFetch('http://localhost:5197/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        const productsArray = (Array.isArray(data) ? data : (Array.isArray(data.$values) ? data.$values : []))
          .map(p => {
            const mainImage = p.imageUrl ? (p.imageUrl.startsWith('/') ? p.imageUrl : `/images/${p.imageUrl}`) : null;
            const productImagesRaw = Array.isArray(p.ProductImages?.$values) ? p.ProductImages.$values : (p.ProductImages || []);
            const productImages = productImagesRaw.map(img => {
              const imgUrl = img.imageUrl || img.url || img.path || '';
              return { ...img, imageUrl: imgUrl.startsWith('/') ? imgUrl : `/images/${imgUrl}` };
            });
            return { ...p, imageUrl: mainImage, productImages };
          });
        setProducts(productsArray);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    const token = localStorage.getItem('token') || await getNewAccessToken();
    if (!token) return navigate('/login');
    try {
      const res = await fetch(`http://localhost:5197/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setProducts(products.filter(p => p.id !== id));
      else alert('Delete failed');
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditForm({
      ...product,
      image: null,
      existingMainImage: product.imageUrl,
      additionalImages: [],
      existingImages: product.productImages || [],
      oldPrice: product.oldPrice ?? null
    });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token') || await getNewAccessToken();
    if (!token) return navigate('/login');

    const formData = new FormData();
    formData.append('price', editForm.price);
    if(editForm.oldPrice !== null && editForm.oldPrice !== undefined) formData.append('oldPrice', editForm.oldPrice);
    formData.append('name', editForm.name);
    formData.append('description', editForm.description);
    formData.append('stock', editForm.stock);

    if(editForm.image) formData.append('image', editForm.image);
    else if(editForm.existingMainImage) formData.append('existingMainImageUrl', editForm.existingMainImage);

    editForm.additionalImages.forEach(file => formData.append('additionalImages', file));
    editForm.existingImages.forEach(img => formData.append('existingImageUrls', img.imageUrl));

    const res = await fetch(`http://localhost:5197/api/products/${editingProduct.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    if (res.ok) {
      const updatedProduct = await res.json();
      setProducts(products.map(p => p.id === editingProduct.id ? {
        ...updatedProduct,
        imageUrl: editForm.image ? `/images/${updatedProduct.imageUrl}` : editForm.existingMainImage,
        productImages: (updatedProduct.ProductImages || []).map(img => ({
          ...img,
          imageUrl: img.imageUrl.startsWith('/') ? img.imageUrl : `/${img.imageUrl}`
        }))
      } : p));
      setEditingProduct(null);
    } else alert('Update failed');
  };

  const handleAdd = async () => {
    const token = localStorage.getItem('token') || await getNewAccessToken();
    if (!token) return navigate('/login');

    const formData = new FormData();
    formData.append('price', newProduct.price);
    if(newProduct.oldPrice !== null && newProduct.oldPrice !== undefined) formData.append('oldPrice', newProduct.oldPrice);
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('stock', newProduct.stock);

    if(newProduct.image) formData.append('image', newProduct.image);
    newProduct.additionalImages.forEach(file => formData.append('productImages', file));

    const res = await fetch('http://localhost:5197/api/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    if (res.ok) {
      const addedProduct = await res.json();
      setProducts([...products, {
        ...addedProduct,
        productImages: (addedProduct.ProductImages || []).map(img => ({
          ...img,
          imageUrl: img.imageUrl.startsWith('/') ? img.imageUrl : `/${img.imageUrl}`
        }))
      }]);
      setShowAddModal(false);
    } else alert('Adding product failed');
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
    <div className="container-fluid manage-products-container">
  <div className="d-flex flex-column flex-md-row align-items-center mb-3 gap-2">
    <button className="btn btn-outline-secondary mb-2 mb-md-0" onClick={() => navigate('/admin')}>
      ← Back
    </button>
    <h2 className="text-center flex-grow-1 m-0 mt-3 mt-md-0">
      Manage Products
    </h2>
    <button className="btn btn-outline-primary mt-2 mt-md-0" onClick={() => { 
        setNewProduct({ name:'', price:'', oldPrice:null, description:'', stock:'', image:null, additionalImages:[] }); 
        setShowAddModal(true); 
    }}>
      ➕ Add Product
    </button>
  </div>

      <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="form-control mb-3" />

      <div className="table-responsive">
    <table className="table table-hover ">
      <thead className="table-light">
        <tr>
          <th>#</th>
          <th>Name</th>
          <th className="d-none d-sm-table-cell">Description</th>
          <th>Price</th>
          <th>Stock</th>
          <th className="d-none d-sm-table-cell">Main Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredProducts.length ? filteredProducts.map((p,i)=>(
          <tr key={p.id} style={{ border: p.stock<=0?'2px solid red':'none', backgroundColor: p.stock<=0?'#fff5f5':'transparent' }}>
            <td>{i+1}</td>
            <td>{p.name}</td>
            <td className="d-none d-sm-table-cell">{p.description}</td>
            <td>
              {p.oldPrice && p.oldPrice>p.price && (
                <span style={{ textDecoration:'line-through', color:'#dc3545', marginRight:'5px' }}>${p.oldPrice.toFixed(2)}</span>
              )}
              <span style={{ fontWeight:'bold', color:'#007bff' }}>${p.price.toFixed(2)}</span>
            </td>
            <td>{p.stock}</td>
            <td className="d-none d-sm-table-cell">
              {p.imageUrl && <img src={`http://localhost:5197${p.imageUrl}`} width="50" alt={p.name} className="me-2"/>}
              {p.productImages && p.productImages.length > 0 && <img src={`http://localhost:5197${p.productImages[0].imageUrl}`} width="50" alt={`${p.name}-second`} />}
            </td>
            <td className="d-flex gap-1 flex-wrap">
              <button className="btn btn-sm btn-outline-primary" onClick={()=>openEditModal(p)}>Edit</button>
              <button className="btn btn-sm btn-outline-danger" onClick={()=>handleDelete(p.id)}>Delete</button>
            </td>
          </tr>
        )) : <tr><td colSpan="7" className="text-center">No products found</td></tr>}
      </tbody>
    </table>
  </div>

      {editingProduct && (
        <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
        <div className="modal-content">
          <div className="modal-header"><h5>Edit Product</h5><button className="btn-close" onClick={()=>setEditingProduct(null)}></button></div>
          <div className="modal-body">
                {['name','price','oldPrice','description','stock'].map(f => (
                  <div key={f} className="mb-3">
                    <label>
                      {f === 'price' ? 'Price' : f === 'oldPrice' ? 'Old Price' : f.charAt(0).toUpperCase() + f.slice(1)}
                    </label>
                    <input
                      type={f === 'price' || f === 'stock' || f === 'oldPrice' ? 'number' : 'text'}
                      className="form-control"
                      value={f === 'price' ? editForm.price : f === 'oldPrice' ? (editForm.oldPrice ?? '') : editForm[f]}
                      onChange={e => setEditForm({...editForm, [f]: f==='oldPrice' && !e.target.value ? null : e.target.value})}
                      required={f === 'price' || f === 'name'}
                    />
                  </div>
                ))}
                <div className="mb-3">
                  <label>Main Image</label>
                  <input type="file" className="form-control" onChange={e=>setEditForm({...editForm,image:e.target.files[0]})}/>
                </div>
                <div className="mb-3">
                  <label>Additional Images</label>
                  <div className="d-flex mb-2">
                    {editForm.existingImages.map((img,idx)=><img key={idx} src={`http://localhost:5197${img.imageUrl}`} width="50" alt={`existing-${idx}`} className="me-2"/>)}
                  </div>
                  <input type="file" className="form-control" multiple onChange={e=>setEditForm({...editForm,additionalImages:Array.from(e.target.files)})}/>
                </div>
              </div>
              <div className="modal-footer d-flex flex-column flex-sm-row gap-2">
                <button className="btn btn-secondary" onClick={()=>setEditingProduct(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleUpdate}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
        <div className="modal-content">
          <div className="modal-header"><h5>Add Product</h5><button className="btn-close" onClick={()=>setShowAddModal(false)}></button></div>
          <div className="modal-body">
                {['name','price','oldPrice','description','stock'].map(f=>(
                  <div key={f} className="mb-3">
                    <label>{f==='price'?'Price': f==='oldPrice'?'Old Price': f.charAt(0).toUpperCase()+f.slice(1)}</label>
                    <input
                      type={f==='price'||f==='stock'||f==='oldPrice'?'number':'text'}
                      className="form-control"
                      value={f==='price'? newProduct.price : f==='oldPrice'? (newProduct.oldPrice ?? '') : newProduct[f]}
                      onChange={e=>setNewProduct({...newProduct,[f]:f==='oldPrice' && !e.target.value ? null : e.target.value})}
                      required={f==='price' || f==='name'}
                    />
                  </div>
                ))}
                <div className="mb-3">
                  <label>Main Image</label>
                  <input type="file" className="form-control" onChange={e=>setNewProduct({...newProduct,image:e.target.files[0]})}/>
                </div>
                <div className="mb-3">
                  <label>Additional Images</label>
                  <input type="file" className="form-control" multiple onChange={e=>setNewProduct({...newProduct,additionalImages:Array.from(e.target.files)})}/>
                </div>
              </div>
              <div className="modal-footer d-flex flex-column flex-sm-row gap-2">
                <button className="btn btn-secondary" onClick={()=>setShowAddModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAdd}>Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

};

export default ManageProducts;
