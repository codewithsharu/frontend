import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X } from 'react-feather';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/config';

const FilterSidebar = () => {
    const [searchParams, setSearchParam] = useSearchParams();
    const navigate = useNavigate();
    const [filter, setFilter] = useState({
        collection: 'All',
        category: 'All',
        gender: '',
        color: '',
        size: [],
        material: [],
        brand: [],
        minPrice: 0,
        maxPrice: 10000,
    });
    const [collectionOptions, setCollectionOptions] = useState(['All']);

    const categories = ['All', 'Tops', 'Bottoms', 'Saree', 'Lehenga', 'Western Dresses', 'Co-ords'];
    const categoryToApiValue = {
        Tops: 'Top Wear',
        Bottoms: 'Bottom Wear',
        Saree: 'Saree',
        Lehenga: 'Lehenga',
        'Western Dresses': 'Western Dresses',
        'Co-ords': 'Co-ords',
    };
    const categoryFromApiValue = {
        'Top Wear': 'Tops',
        'Bottom Wear': 'Bottoms',
        Saree: 'Saree',
        Lehenga: 'Lehenga',
        'Western Dresses': 'Western Dresses',
        'Co-ords': 'Co-ords',
    };
    const colors = [
        { name: 'Red', hex: '#EF4444' },
        { name: 'Blue', hex: '#3B82F6' },
        { name: 'Black', hex: '#111827' },
        { name: 'Green', hex: '#16A34A' },
        { name: 'Yellow', hex: '#EAB308' },
        { name: 'Gray', hex: '#9CA3AF' },
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Pink', hex: '#F472B6' },
        { name: 'Beige', hex: '#D2B48C' },
        { name: 'Navy', hex: '#1E3A5F' },
    ];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const materials = ['Cotton', 'Wool', 'Denim', 'Polyester', 'Silk', 'Linen', 'Viscose', 'Fleece'];
    const brands = ['Urban Threads', 'Modern Fit', 'Gucci', 'Street Style', 'Beach Breeze', 'Fashion Insta'];
    const genders = ['Men', 'Women'];

    const activeFilterCount = [
        filter.collection !== 'All' ? 1 : 0,
        filter.category !== 'All' ? 1 : 0,
        filter.gender ? 1 : 0,
        filter.color ? 1 : 0,
        filter.size.length,
        filter.material.length,
        filter.brand.length,
        filter.maxPrice < 10000 ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    const clearFilters = () => {
        const cleared = {
            collection: 'All',
            category: 'All',
            gender: '',
            color: '',
            size: [],
            material: [],
            brand: [],
            minPrice: 0,
            maxPrice: 10000,
        };
        setFilter(cleared);
        setSearchParam({});
        navigate('/collections/all');
    };

    useEffect(() => {
        const fetchCollectionOptions = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/products/collections`);
                const apiCollections = Array.isArray(response.data?.collections)
                    ? response.data.collections
                    : [];

                const normalized = apiCollections
                    .map((name) => String(name || '').trim())
                    .filter(Boolean);

                const withAll = ['All', ...normalized.filter((name) => name.toLowerCase() !== 'all')];
                setCollectionOptions(withAll);
            } catch (error) {
                // Keep default fallback values when collections endpoint is unavailable.
                setCollectionOptions(['All']);
            }
        };

        fetchCollectionOptions();
    }, []);

    useEffect(() => {
        const params = Object.fromEntries([...searchParams]);
        setFilter({
            collection: params.collection || 'All',
            category: params.category ? (categoryFromApiValue[params.category] || params.category) : 'All',
            gender: params.gender || '',
            color: params.color || '',
            size: params.size ? params.size.split(',') : [],
            material: params.material ? params.material.split(',') : [],
            brand: params.brand ? params.brand.split(',') : [],
            minPrice: params.minPrice || 0,
            maxPrice: params.maxPrice || 10000,
        });
    }, [searchParams]);

    const updateURLParams = (newFilters) => {
        const params = new URLSearchParams();
        Object.keys(newFilters).forEach((key) => {
            if (key === 'collection' && newFilters[key] && String(newFilters[key]).toLowerCase() !== 'all') {
                params.append('collection', newFilters[key]);
                return;
            }
            if (key === 'category' && newFilters[key] && newFilters[key] !== 'All') {
                const mappedCategory = categoryToApiValue[newFilters[key]] || newFilters[key];
                params.append('category', mappedCategory);
                return;
            }
            if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
                params.append(key, newFilters[key].join(','));
            } else if (newFilters[key] && newFilters[key] !== 'All') {
                params.append(key, newFilters[key]);
            }
        });
        setSearchParam(params);
        navigate(`/collections/all${params.toString() ? '?' + params.toString() : ''}`);
    };

    // Single-select handler (category, gender, color)
    const handleSingleSelect = (name, value) => {
        const newFilters = { ...filter };
        // Toggle off if already selected (except category 'All')
        if (name === 'gender' || name === 'color') {
            newFilters[name] = newFilters[name] === value ? '' : value;
        } else {
            newFilters[name] = value;
        }
        setFilter(newFilters);
        updateURLParams(newFilters);
    };

    // Multi-select handler (size, material, brand)
    const handleMultiSelect = (name, value) => {
        const newFilters = { ...filter };
        if (newFilters[name].includes(value)) {
            newFilters[name] = newFilters[name].filter((item) => item !== value);
        } else {
            newFilters[name] = [...newFilters[name], value];
        }
        setFilter(newFilters);
        updateURLParams(newFilters);
    };

    // Price handler
    const handlePriceChange = (e) => {
        const newFilters = { ...filter, maxPrice: e.target.value };
        setFilter(newFilters);
        updateURLParams(newFilters);
    };

    return (
        <div className="p-5 bg-white border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                    {activeFilterCount > 0 && (
                        <span className="bg-lv-dark text-white text-[11px] font-bold px-2 py-0.5">{activeFilterCount}</span>
                    )}
                </div>
                {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-sm font-semibold text-lv-gold hover:text-lv-gold/80 transition-colors">
                        Clear All
                    </button>
                )}
            </div>

            {/* Collection */}
            <div className="mb-5 pb-5 border-b border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Collection</h4>
                <select
                    value={filter.collection}
                    onChange={(e) => handleSingleSelect('collection', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm font-medium bg-white border border-gray-200 text-gray-700 focus:outline-none focus:border-lv-gold"
                >
                    {collectionOptions.map((collection) => (
                        <option key={collection} value={collection}>
                            {collection}
                        </option>
                    ))}
                </select>
            </div>

            {/* Category */}
            <div className="mb-5 pb-5 border-b border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Category</h4>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleSingleSelect('category', category)}
                            className={`px-4 py-2 text-sm font-medium transition-all
                                ${filter.category === category
                                    ? 'bg-lv-dark text-white'
                                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-lv-gold hover:bg-gray-100'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Gender */}
            <div className="mb-5 pb-5 border-b border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Gender</h4>
                <div className="flex gap-2">
                    {genders.map((gender) => (
                        <button
                            key={gender}
                            onClick={() => handleSingleSelect('gender', gender)}
                            className={`flex-1 py-2.5 text-sm font-semibold transition-all text-center
                                ${filter.gender === gender
                                    ? 'bg-lv-dark text-white'
                                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-lv-gold hover:bg-gray-100'
                                }`}
                        >
                            {gender}
                        </button>
                    ))}
                </div>
            </div>

            {/* Color */}
            <div className="mb-5 pb-5 border-b border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Color</h4>
                <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                        <button
                            key={color.name}
                            onClick={() => handleSingleSelect('color', color.name)}
                            className="group flex flex-col items-center gap-1"
                            title={color.name}
                        >
                            <div
                                className={`w-9 h-9 rounded-full border-2 transition-all
                                    ${filter.color === color.name
                                        ? 'border-black scale-110 shadow-md'
                                        : color.name === 'White' ? 'border-gray-300 hover:border-gray-500' : 'border-transparent hover:border-gray-400'
                                    }`}
                                style={{ backgroundColor: color.hex }}
                            >
                                {filter.color === color.name && (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <svg className={`w-4 h-4 ${color.name === 'White' || color.name === 'Yellow' || color.name === 'Beige' ? 'text-black' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <span className={`text-[10px] ${filter.color === color.name ? 'text-black font-bold' : 'text-gray-500'}`}>{color.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Size */}
            <div className="mb-5 pb-5 border-b border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Size</h4>
                <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => handleMultiSelect('size', size)}
                            className={`w-12 h-10 text-sm font-semibold transition-all flex items-center justify-center
                                ${filter.size.includes(size)
                                    ? 'bg-lv-dark text-white'
                                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-lv-gold hover:bg-gray-100'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Material */}
            <div className="mb-5 pb-5 border-b border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Material</h4>
                <div className="flex flex-wrap gap-2">
                    {materials.map((material) => (
                        <button
                            key={material}
                            onClick={() => handleMultiSelect('material', material)}
                            className={`px-3.5 py-2 text-sm font-medium transition-all
                                ${filter.material.includes(material)
                                    ? 'bg-lv-dark text-white'
                                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-lv-gold hover:bg-gray-100'
                                }`}
                        >
                            {material}
                            {filter.material.includes(material) && <X className="w-3.5 h-3.5 inline ml-1.5 -mr-0.5" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Brand */}
            <div className="mb-5 pb-5 border-b border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Brand</h4>
                <div className="flex flex-wrap gap-2">
                    {brands.map((brand) => (
                        <button
                            key={brand}
                            onClick={() => handleMultiSelect('brand', brand)}
                            className={`px-3.5 py-2 text-sm font-medium transition-all
                                ${filter.brand.includes(brand)
                                    ? 'bg-lv-dark text-white'
                                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-lv-gold hover:bg-gray-100'
                                }`}
                        >
                            {brand}
                            {filter.brand.includes(brand) && <X className="w-3.5 h-3.5 inline ml-1.5 -mr-0.5" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Price Range</h4>
                <div className="px-1">
                    <input
                        type="range"
                        name="maxPrice"
                        min={0}
                        max={10000}
                        step={100}
                        value={filter.maxPrice}
                        onChange={handlePriceChange}
                        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-black"
                    />
                    <div className="flex justify-between mt-2">
                        <span className="text-sm font-medium text-gray-600">₹0</span>
                        <span className="text-sm font-bold text-black">₹{Number(filter.maxPrice).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Clear All Button */}
            {activeFilterCount > 0 && (
                <button
                    onClick={clearFilters}
                    className="w-full mt-2 px-4 py-2.5 bg-lv-dark text-white text-sm font-semibold hover:bg-lv-dark/90 transition-colors">
                    Clear All Filters ({activeFilterCount})
                </button>
            )}
        </div>
    );
};

export default FilterSidebar;