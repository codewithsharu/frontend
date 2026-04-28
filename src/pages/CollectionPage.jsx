import React, { useEffect, useRef, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productSlice';

const SIDEBAR_WIDTH = 250; // px

const CollectionPage = () => {
    const { collection } = useParams();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const selectedCollection = collection || 'all';
    
    const { products, loading, error } = useSelector((state) => state.products);
    const queryParams = Object.fromEntries([...searchParams]);
    const normalizedQueryParams =
        queryParams.category?.toLowerCase() === 'collection'
            ? { ...queryParams, category: 'All' }
            : queryParams;
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    useEffect(() => {
        // console.log("Fetching products with:", { collection, ...queryParams });
        dispatch(fetchProductsByFilters({ collection: selectedCollection, ...normalizedQueryParams }));
    }, [dispatch, selectedCollection, JSON.stringify(normalizedQueryParams)]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleClickOutside = (e) => {
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col lg:flex-row">
            <button
                onClick={toggleSidebar}
                className="lg:hidden border p-2 flex justify-center items-center"
                style={{ width: '100%' }}
            >
                <FaFilter className="mr-2" /> Filters
            </button>

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                style={{
                    width: SIDEBAR_WIDTH,
                    minWidth: SIDEBAR_WIDTH,
                    maxWidth: SIDEBAR_WIDTH,
                    boxShadow: '0 0 8px 0 rgba(0,0,0,0.04)',
                    borderRight: '1px solid #f3f3f3',
                    zIndex: 50,
                }}
                className={`
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    fixed inset-y-0 left-0 bg-white overflow-y-auto transition-transform duration-300
                    lg:static lg:translate-x-0
                    h-full
                `}
            >
                <div className="hidden lg:block" style={{ height: 24 }} /> {/* Spacer for desktop */}
                <FilterSidebar />
            </div>

            {/* Main Content */}
            <div
                className="flex-grow p-4"
                style={{
                    marginLeft: 0,
                }}
            >
                <div className="mb-6">
                  <p className="text-xs tracking-[0.3em] uppercase text-lv-gold mb-1">Shop</p>
                  <h2 className="font-serif text-2xl md:text-3xl text-lv-dark tracking-wide">All Collection</h2>
                  <div className="w-10 h-[1px] bg-lv-gold mt-3" />
                </div>
                <SortOptions />
                
                {loading ? (
                    <p>Loading products...</p>
                ) : error ? (
                    <p className="text-red-500">Error: {error}</p>
                ) : products.length > 0 ? (
                    <ProductGrid products={products} loading={loading} error={error} />
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </div>
    );
};

export default CollectionPage;
