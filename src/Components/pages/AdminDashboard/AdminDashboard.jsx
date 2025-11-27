import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductService from '../../../services/ProductService';
import AdminService from '../../../Services/AdminService'; 
import { useAuth } from '../../../context/AuthContext';
import './AdminDashboard.css';

// ==========================================
// 1. SUB-COMPONENTE: GRÁFICO DE BARRAS
// ==========================================
const SimpleBarChart = ({ data, label }) => {
    const maxVal = data.length > 0 ? Math.max(...data.map(d => d.value)) : 1;
    return (
        <div className="chart-container">
            <h3>{label}</h3>
            <div className="chart-bars">
                {data.map((item, index) => (
                    <div key={index} className="chart-column">
                        <div 
                            className="bar" 
                            style={{ height: `${(item.value / (maxVal || 1)) * 100}%` }}
                            title={`${item.label}: $${item.value?.toLocaleString('es-CL')}`}
                        ></div>
                        <span className="bar-label">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ==========================================
// 2. SUB-COMPONENTE: VISTA GENERAL (STATS)
// ==========================================
const AdminOverview = () => {
    const [backendStats, setBackendStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { logout } = useAuth(); 
    const navigate = useNavigate();

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setIsLoading(true);
            const response = await AdminService.getStats();
            setBackendStats(response.data);
            setIsLoading(false);
        } catch (err) {
            console.error("Error al cargar estadísticas:", err);
            setIsLoading(false);
            
            if (err.response && err.response.status === 403) {
                setError("FORBIDDEN");
            } else {
                setError("No se pudieron cargar los datos.");
            }
        }
    };

    const handleForceLogout = () => {
        logout();
        navigate('/login');
    };

    if (isLoading) return <div className="p-4">Cargando estadísticas...</div>;

    if (error === "FORBIDDEN") {
        return (
            <div className="admin-view fade-in">
                <div className="server-message error" style={{ textAlign: 'center', padding: '40px' }}>
                    <h2 style={{ color: '#ff4d4d' }}>⛔ Acceso Denegado (403)</h2>
                    <p>Tu sesión ha expirado o no tienes permisos.</p>
                    <button className="btn-primary-admin" onClick={handleForceLogout} style={{ backgroundColor: '#ff4d4d', marginTop: '20px' }}>
                        Recargar Sesión
                    </button>
                </div>
            </div>
        );
    }

    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (!backendStats) return null;

    const chartData = [
        { label: 'Hoy', value: backendStats.salesToday || 0 },
        { label: 'Semana', value: backendStats.salesWeek || 0 },
        { label: 'Mes', value: backendStats.salesMonth || 0 },
    ];

    return (
        <div className="admin-view fade-in">
            <div className="admin-header">
                <h2>Resumen de Ventas</h2>
                <div className="time-filters">
                    <span className="badge">Actualizado: {new Date().toLocaleTimeString()}</span>
                </div>
            </div>

            <div className="kpi-grid">
                <div className="kpi-card blue">
                    <h3>Ventas Hoy</h3>
                    <p>${(backendStats.salesToday || 0).toLocaleString('es-CL')}</p>
                    <span className="trend">Pedidos: {backendStats.ordersToday || 0}</span>
                </div>
                <div className="kpi-card green">
                    <h3>Ventas Mes</h3>
                    <p>${(backendStats.salesMonth || 0).toLocaleString('es-CL')}</p>
                </div>
                <div className="kpi-card purple">
                    <h3>Ventas Año</h3>
                    <p>${(backendStats.salesYear || 0).toLocaleString('es-CL')}</p>
                </div>
            </div>

            <div className="dashboard-grid-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                <div className="chart-section">
                    <SimpleBarChart data={chartData} label="Ingresos" />
                </div>
                <div className="recent-orders-section table-container">
                    <h3 style={{ padding: '15px', borderBottom: '1px solid #333' }}>Últimos Pedidos</h3>
                    <table className="admin-table">
                        <thead>
                            <tr><th>ID</th><th>Fecha</th><th>Total</th></tr>
                        </thead>
                        <tbody>
                            {backendStats.recentOrders?.length > 0 ? (
                                backendStats.recentOrders.map(order => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                        {/* CORRECCIÓN: Usamos finalPrice en lugar de totalAmount */}
                                        <td>${(order.finalPrice || 0).toLocaleString('es-CL')}</td>
                                    </tr>
                                ))
                            ) : <tr><td colSpan="3">Sin pedidos recientes</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 3. SUB-COMPONENTE: GESTIÓN DE USUARIOS
// ==========================================
const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        setIsLoading(true);
        AdminService.getAllUsers()
            .then(res => setUsers(res.data))
            .catch(err => console.error("Error cargando usuarios", err))
            .finally(() => setIsLoading(false));
    };

    const handleBanToggle = async (user) => {
        const action = user.locked ? "desbanear" : "banear";
        if (window.confirm(`¿Estás seguro de que deseas ${action} a ${user.username}?`)) {
            try {
                await AdminService.toggleUserBan(user.id);
                // Actualizamos la lista localmente
                setUsers(users.map(u => 
                    u.id === user.id ? { ...u, locked: !u.locked } : u
                ));
            } catch (error) {
                alert("No se pudo cambiar el estado del usuario.");
            }
        }
    };

    if (isLoading) return <div>Cargando usuarios...</div>;

    return (
        <div className="admin-view fade-in">
            <div className="admin-header">
                <h2>Gestión de Usuarios</h2>
                <span className="badge">Total: {users.length}</span>
            </div>
            
            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th><th>Usuario</th><th>Email</th><th>Rol</th><th>Estado</th><th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className={user.locked ? "row-banned" : ""}>
                                <td>#{user.id}</td>
                                <td style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                    <div className="admin-avatar" style={{width:'30px', height:'30px', fontSize:'12px'}}>
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    {user.username}
                                </td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`badge ${user.userRole === 'ROLE_ADMIN' ? 'badge-admin' : 'badge-user'}`}>
                                        {user.userRole.replace('ROLE_', '')}
                                    </span>
                                </td>
                                <td>
                                    {user.locked ? 
                                        <span style={{color: 'red', fontWeight: 'bold'}}>⛔ Baneado</span> : 
                                        <span style={{color: 'green'}}>✅ Activo</span>
                                    }
                                </td>
                                <td>
                                    {user.userRole !== 'ROLE_ADMIN' && (
                                        <button 
                                            className={`btn-action ${user.locked ? 'btn-unban' : 'btn-ban'}`}
                                            onClick={() => handleBanToggle(user)}
                                            style={{
                                                padding: '5px 10px',
                                                borderRadius: '4px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                backgroundColor: user.locked ? '#4caf50' : '#ff4d4d',
                                                color: 'white'
                                            }}
                                        >
                                            {user.locked ? "🔓 Desbanear" : "🔒 Banear"}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ==========================================
// 4. SUB-COMPONENTE: GESTIÓN DE PRODUCTOS
// ==========================================
const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    
    const initialFormState = { 
        name: '', price: 0, category: '', description: '', 
        manufacturer: '', distributor: '', 
        imageFile: null 
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => { loadProducts(); }, []);

    const loadProducts = () => {
        setIsLoading(true);
        ProductService.getAllProducts()
            .then(res => setProducts(res.data))
            .catch(err => console.error("Error cargando productos", err))
            .finally(() => setIsLoading(false));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        const dataToSend = new FormData();
        dataToSend.append('name', formData.name);
        dataToSend.append('price', formData.price);
        dataToSend.append('category', formData.category);
        dataToSend.append('description', formData.description);
        dataToSend.append('manufacturer', formData.manufacturer);
        dataToSend.append('distributor', formData.distributor);
        
        if (formData.imageFile) {
            dataToSend.append('image', formData.imageFile);
        }

        try {
            if (currentProduct) {
                await ProductService.updateProduct(currentProduct.id, dataToSend);
            } else {
                await ProductService.createProduct(dataToSend);
            }
            setIsFormOpen(false);
            loadProducts();
            alert(currentProduct ? "Producto actualizado" : "Producto creado");
        } catch (error) {
            console.error(error);
            alert("Error al guardar.");
        }
    };

    const openCreate = () => { 
        setCurrentProduct(null); 
        setFormData(initialFormState); 
        setIsFormOpen(true); 
    };

    const openEdit = (p) => { 
        setCurrentProduct(p); 
        setFormData({ 
            name: p.name, 
            price: p.price, 
            category: p.category, 
            description: p.description || '', 
            manufacturer: p.manufacturer || '', 
            distributor: p.distributor || '',
            imageFile: null 
        }); 
        setIsFormOpen(true); 
    };

    const handleDelete = async (id) => { 
        if(window.confirm("¿Borrar este producto?")) { 
            try { await ProductService.deleteProduct(id); loadProducts(); } 
            catch(e) { alert("No se pudo eliminar"); }
        } 
    };

    return (
        <div className="admin-view fade-in">
            <div className="admin-header">
                <h2>Gestión de Productos</h2>
                <button className="btn-primary-admin" onClick={openCreate}>+ Nuevo Producto</button>
            </div>
            
            <div className="table-container">
                <table className="admin-table">
                    <thead><tr><th>Img</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Acciones</th></tr></thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td>
                                    {p.imageUrl ? (
                                        <img src={p.imageUrl} alt="mini" style={{width:'40px', height:'40px', objectFit:'cover', borderRadius:'4px'}}/>
                                    ) : <span>📦</span>}
                                </td>
                                <td>{p.name}</td>
                                <td>{p.category}</td>
                                <td>${p.price.toLocaleString('es-CL')}</td>
                                <td>
                                    <button className="action-btn edit" onClick={() => openEdit(p)}>✏️</button>
                                    <button className="action-btn delete" onClick={() => handleDelete(p.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isFormOpen && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h3>{currentProduct ? 'Editar' : 'Nuevo'}</h3>
                        <form onSubmit={handleFormSubmit} className="product-form">
                            <div className="form-row">
                                <div className="form-group"><label>Nombre</label><input value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} required/></div>
                                <div className="form-group"><label>Precio</label><input type="number" value={formData.price} onChange={e=>setFormData({...formData, price:Number(e.target.value)})} required/></div>
                            </div>
                            <div className="form-row">
                                <div className="form-group"><label>Categoría</label><input value={formData.category} onChange={e=>setFormData({...formData, category:e.target.value})} required/></div>
                                <div className="form-group"><label>Imagen</label><input type="file" accept="image/*" onChange={e => setFormData({...formData, imageFile: e.target.files[0]})}/></div>
                            </div>
                            <div className="form-group"><label>Descripción</label><textarea value={formData.description} onChange={e=>setFormData({...formData, description:e.target.value})} rows="3"/></div>
                            <div className="form-row">
                                <div className="form-group"><label>Fabricante</label><input value={formData.manufacturer} onChange={e=>setFormData({...formData, manufacturer:e.target.value})}/></div>
                                <div className="form-group"><label>Distribuidor</label><input value={formData.distributor} onChange={e=>setFormData({...formData, distributor:e.target.value})}/></div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary-admin" onClick={()=>setIsFormOpen(false)}>Cancelar</button>
                                <button type="submit" className="btn-primary-admin">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// ==========================================
// 5. COMPONENTE PRINCIPAL (LAYOUT)
// ==========================================
const AdminDashboard = () => {
    const [activeView, setActiveView] = useState('overview'); 
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    useEffect(() => {
        if (user && user.userRole !== 'ROLE_ADMIN') navigate('/');
    }, [user, navigate]);

    if (!user || user.userRole !== 'ROLE_ADMIN') return null; 

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-brand"><h2>Admin<span>Panel</span></h2></div>
                <nav className="admin-nav">
                    <ul>
                        <li className={activeView === 'overview' ? 'active' : ''} onClick={() => setActiveView('overview')}>📊 Dashboard</li>
                        <li className={activeView === 'products' ? 'active' : ''} onClick={() => setActiveView('products')}>📦 Productos</li>
                        <li className={activeView === 'users' ? 'active' : ''} onClick={() => setActiveView('users')}>👥 Usuarios</li>
                    </ul>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={() => navigate('/')} className="back-store-btn">⬅ Tienda</button>
                    <button onClick={() => { logout(); navigate('/login'); }} className="logout-btn">Salir</button>
                </div>
            </aside>
            <main className="admin-main">
                <header className="top-bar">
                    <div className="breadcrumbs">
                        Admin / {activeView === 'overview' ? 'Resumen' : activeView === 'products' ? 'Productos' : 'Usuarios'}
                    </div>
                    <div className="admin-profile">
                        <span>{user.username}</span>
                        <div className="admin-avatar">{user.username.charAt(0).toUpperCase()}</div>
                    </div>
                </header>
                <div className="content-wrapper">
                    {activeView === 'overview' && <AdminOverview />}
                    {activeView === 'products' && <AdminProducts />}
                    {activeView === 'users' && <AdminUsers />}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;