import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import ProductGrid from './ProductGrid';
import { useParams, useNavigate } from 'react-router-dom'; // Updated this line
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, fetchSimilarProduct } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { Heart, Minus, Plus, ShoppingBag, Share2, Truck, RefreshCw, X, FileText } from 'react-feather';
import { FaWhatsapp } from 'react-icons/fa';
import tinycolor from 'tinycolor2';
import { API_BASE_URL } from '../../utils/config';
import customGuideHowToMeasure from '../../assets/customsizeguide/1.png';
import customGuideSizeChart from '../../assets/customsizeguide/2.png';

const CUSTOM_SIZE_VALUE = 'CUSTOM';
const WHATSAPP_QUOTE_NUMBER = '917460935762';

const CUSTOM_MEASUREMENT_FIELDS = [
  {
    id: 'bustChest',
    label: 'Bust / Chest',
    shortLabel: 'Bust',
    placeholder: 'e.g. 38',
    description: 'Measure around the fullest part of your bust, keeping the tape straight and relaxed.',
  },
  {
    id: 'waist',
    label: 'Waist',
    shortLabel: 'Waist',
    placeholder: 'e.g. 32',
    description: 'Measure around the narrowest part of your waistline.',
  },
  {
    id: 'hips',
    label: 'Hips',
    shortLabel: 'Hips',
    placeholder: 'e.g. 40',
    description: 'Measure around the fullest part of your hips.',
  },
  {
    id: 'shoulderWidth',
    label: 'Shoulder Width',
    shortLabel: 'Shoulder',
    placeholder: 'e.g. 18',
    description: 'Measure from the tip of one shoulder to the other.',
  },
  {
    id: 'sleeveLength',
    label: 'Sleeve Length',
    shortLabel: 'Sleeve',
    placeholder: 'e.g. 24',
    description: 'Measure from shoulder tip to wrist bone.',
  },
  {
    id: 'armhole',
    label: 'Armhole',
    shortLabel: 'Armhole',
    placeholder: 'e.g. 16',
    description: 'Measure around the fullest part of your upper arm (armhole area).',
  },
  {
    id: 'bicepSize',
    label: 'Bicep Size',
    shortLabel: 'Bicep',
    placeholder: 'e.g. 14',
    description: 'Measure around the fullest part of your bicep (upper arm circumference), keeping the tape snug but not tight.',
  },
];

const createEmptyCustomMeasurementForm = () =>
  CUSTOM_MEASUREMENT_FIELDS.reduce((acc, field) => {
    acc[field.id] = '';
    return acc;
  }, {});

const formatCustomMeasurementValue = (value) => Number(value).toFixed(1).replace('.0', '');

const buildCustomMeasurementKey = (measurements) =>
  CUSTOM_MEASUREMENT_FIELDS.map((field) => `${field.id}:${Number(measurements[field.id]).toFixed(2)}`).join('|');

const CustomSizeIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M4 7.5a2.5 2.5 0 0 1 2.5-2.5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
    <path d="M8 8.5v2.5M10.5 8.5v1.5M13 8.5v2.5M15.5 8.5v1.5" />
    <path d="M7 15h10" />
  </svg>
);

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const navigate = useNavigate(); // Updated this line
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector((state) => state.products);
  const { user, guestId } = useSelector((state) => state.auth);
  const [mainImage, setMainImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [[x, y], setXY] = useState([0, 0]);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [showZoomedView, setShowZoomedView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCustomSizeModalOpen, setIsCustomSizeModalOpen] = useState(false);
  const [isSizeChartModalOpen, setIsSizeChartModalOpen] = useState(false);
  const [customMeasurementForm, setCustomMeasurementForm] = useState(createEmptyCustomMeasurementForm);
  const [customMeasurementErrors, setCustomMeasurementErrors] = useState({});
  const [savedCustomMeasurements, setSavedCustomMeasurements] = useState(null);
  const [customMeasurementKey, setCustomMeasurementKey] = useState('');
  
  const imgRef = useRef(null);
  const measurementInputRefs = useRef([]);
  const saveMeasurementsButtonRef = useRef(null);
  const magnifierSize = 150;
  const ZOOM_LEVEL = 2.5;

  const productFetchId = productId || id;

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProduct({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
      
      const img = new Image();
      img.src = selectedProduct.images[0].url;
      img.onload = () => {
        setSize([img.width, img.height]);
      };
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (!isCustomSizeModalOpen && !isSizeChartModalOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        if (isSizeChartModalOpen) {
          setIsSizeChartModalOpen(false);
          return;
        }

        if (isCustomSizeModalOpen) {
          setIsCustomSizeModalOpen(false);
        }
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isCustomSizeModalOpen, isSizeChartModalOpen]);

  useEffect(() => {
    if (!isCustomSizeModalOpen) {
      return undefined;
    }

    const focusTimerId = window.setTimeout(() => {
      measurementInputRefs.current[0]?.focus();
    }, 0);

    return () => {
      window.clearTimeout(focusTimerId);
    };
  }, [isCustomSizeModalOpen]);

  const handleMeasurementInputKeyDown = (event, inputIndex) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    const nextInput = measurementInputRefs.current[inputIndex + 1];

    if (nextInput) {
      nextInput.focus();
      return;
    }

    saveMeasurementsButtonRef.current?.focus();
  };

  const handleMouseMove = (e) => {
    if (isMobile) return;
    
    const elem = imgRef.current;
    const { left, top, width, height } = elem.getBoundingClientRect();

    const target = e.target;
    
    if (target.closest('button') || target.closest('.button-container')) {
      return;
    }
    
    const x = (e.pageX - left - window.pageXOffset) / width;
    const y = (e.pageY - top - window.pageYOffset) / height;
    
    const magnifierX = e.pageX - magnifierSize / 2;
    const magnifierY = e.pageY - magnifierSize / 2;
    
    setXY([x, y]);
    setMagnifierPosition({ x: magnifierX, y: magnifierY });
  };

  const handleMouseEnter = (e) => {
    if (isMobile) return;
    
    if (e.target.closest('button') || e.target.closest('.button-container')) {
      return;
    }
    
    setShowMagnifier(true);
    setShowZoomedView(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setShowMagnifier(false);
    setShowZoomedView(false);
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => quantity > 1 && setQuantity((prev) => prev - 1);

  const isCustomSizeSelected = selectedSize === CUSTOM_SIZE_VALUE;
  const customMeasurementsPending = isCustomSizeSelected && !savedCustomMeasurements;
  const needsSelection = !selectedSize || !selectedColor || customMeasurementsPending;
  const isOutOfStock = (selectedProduct?.countInStock ?? 0) < 1;
  const isActionBusy = isAddingToCart || isBuyingNow;

  const getSelectionErrorMessage = (actionText) => {
    if (!selectedColor && !selectedSize) {
      return `Please select a color and size before ${actionText}.`;
    }
    if (!selectedColor) {
      return `Please select a color before ${actionText}.`;
    }
    if (!selectedSize) {
      return `Please select a size before ${actionText}.`;
    }
    if (customMeasurementsPending) {
      return `Please add your custom measurements before ${actionText}.`;
    }
    return `Please select a size before ${actionText}.`;
  };

  const getInlineSelectionPrompt = () => {
    if (!selectedColor && !selectedSize) {
      return 'color and size';
    }
    if (!selectedColor) {
      return 'a color';
    }
    if (!selectedSize) {
      return 'a size';
    }
    if (customMeasurementsPending) {
      return 'your custom measurements';
    }
    return 'required options';
  };

  const openCustomSizeModal = () => {
    const nextForm = savedCustomMeasurements
      ? CUSTOM_MEASUREMENT_FIELDS.reduce((acc, field) => {
          acc[field.id] = String(savedCustomMeasurements[field.id] ?? '');
          return acc;
        }, {})
      : createEmptyCustomMeasurementForm();

    setSelectedSize(CUSTOM_SIZE_VALUE);
    setCustomMeasurementForm(nextForm);
    setCustomMeasurementErrors({});
    setIsCustomSizeModalOpen(true);
  };

  const handleCustomMeasurementChange = (fieldId, value) => {
    if (value !== '' && !/^\d{0,3}(\.\d{0,2})?$/.test(value)) {
      return;
    }

    setCustomMeasurementForm((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    if (customMeasurementErrors[fieldId]) {
      setCustomMeasurementErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const handleSaveCustomMeasurements = () => {
    const errors = {};
    const normalizedMeasurements = {};

    CUSTOM_MEASUREMENT_FIELDS.forEach((field) => {
      const rawValue = customMeasurementForm[field.id];
      if (!rawValue) {
        errors[field.id] = 'Required';
        return;
      }

      const numericValue = Number(rawValue);
      if (!Number.isFinite(numericValue) || numericValue <= 0 || numericValue > 100) {
        errors[field.id] = 'Enter a valid inch value';
        return;
      }

      normalizedMeasurements[field.id] = Number(numericValue.toFixed(2));
    });

    if (Object.keys(errors).length > 0) {
      setCustomMeasurementErrors(errors);
      toast.error('Please complete all measurements with valid values.', { duration: 1400 });
      return;
    }

    const nextKey = buildCustomMeasurementKey(normalizedMeasurements);
    setSavedCustomMeasurements(normalizedMeasurements);
    setCustomMeasurementKey(nextKey);
    setCustomMeasurementErrors({});
    setIsCustomSizeModalOpen(false);
    setSelectedSize(CUSTOM_SIZE_VALUE);
    toast.success('Custom size measurements saved.', { duration: 1100 });
  };

  const handleAddToCart = async () => {
    if (needsSelection) {
      toast.error(getSelectionErrorMessage('adding to cart'), { duration: 1200 });
      return;
    }

    if (!productFetchId) {
      toast.error('Product is not ready yet. Please try again.', { duration: 1200 });
      return;
    }

    if (isOutOfStock) {
      toast.error('This product is currently out of stock.', { duration: 1200 });
      return;
    }

    if (isActionBusy) {
      return;
    }

    if (quantity > (selectedProduct?.countInStock ?? 0)) {
      toast.error(`Only ${selectedProduct.countInStock} item(s) available in stock.`, { duration: 1200 });
      return;
    }

    setIsAddingToCart(true);

    try {
      await dispatch(
        addToCart({
          productId: productFetchId,
          quantity,
          size: selectedSize,
          color: selectedColor,
          customMeasurements: isCustomSizeSelected ? savedCustomMeasurements : null,
          customMeasurementKey: isCustomSizeSelected ? customMeasurementKey : '',
          guestId,
          userId: user?._id,
        })
      ).unwrap();

      toast.success('Product added to the cart', { duration: 1000 });
    } catch (err) {
      toast.error(err?.msg || err?.message || 'Failed to add to cart', { duration: 1500 });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (needsSelection) {
      toast.error(getSelectionErrorMessage('proceeding to checkout'), { duration: 1200 });
      return;
    }

    if (!productFetchId) {
      toast.error('Product is not ready yet. Please try again.', { duration: 1200 });
      return;
    }

    if (isOutOfStock) {
      toast.error('This product is currently out of stock.', { duration: 1200 });
      return;
    }

    if (isActionBusy) {
      return;
    }

    if (quantity > (selectedProduct?.countInStock ?? 0)) {
      toast.error(`Only ${selectedProduct.countInStock} item(s) available in stock.`, { duration: 1200 });
      return;
    }

    setIsBuyingNow(true);
    
    try {
      await dispatch(
        addToCart({
          productId: productFetchId,
          quantity,
          size: selectedSize,
          color: selectedColor,
          customMeasurements: isCustomSizeSelected ? savedCustomMeasurements : null,
          customMeasurementKey: isCustomSizeSelected ? customMeasurementKey : '',
          guestId,
          userId: user?._id,
        })
      ).unwrap();

      navigate('/checkout'); // Updated this line
    } catch (err) {
      toast.error(err?.msg || err?.message || 'Failed to add to cart', { duration: 1500 });
    } finally {
      setIsBuyingNow(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!', { duration: 1000 });
  };

  const handleGetBestPriceOnWhatsApp = () => {
    if (needsSelection) {
      toast.error(getSelectionErrorMessage('requesting discounted price'), { duration: 1200 });
      return;
    }

    const colorLabel = selectedColor ? `${selectedColor}`.charAt(0).toUpperCase() + `${selectedColor}`.slice(1) : '';
    const sizeLabel = isCustomSizeSelected ? 'Custom Size' : selectedSize || '';
    const productLink = window.location.href;
    const displayPrice = selectedProduct?.discountPrice ?? selectedProduct?.price;

    const messageLines = [
      'Hello Louis Veil Team,',
      '',
      'I would like to get a discounted price for this product:',
      `Product: ${selectedProduct?.name || 'N/A'}`,
      `Product Link: ${productLink}`,
      `Price: ₹${displayPrice ?? 'N/A'}`,
      `Quantity: ${quantity}`,
    ];

    if (colorLabel) {
      messageLines.push(`Color: ${colorLabel}`);
    }

    if (sizeLabel) {
      messageLines.push(`Size: ${sizeLabel}`);
    }

    if (isCustomSizeSelected) {
      messageLines.push('');
      messageLines.push('Custom Measurements (in inches):');

      if (savedCustomMeasurements) {
        CUSTOM_MEASUREMENT_FIELDS.forEach((field) => {
          const value = savedCustomMeasurements[field.id];
          messageLines.push(`- ${field.label}: ${formatCustomMeasurementValue(value)} in`);
        });
      } else {
        messageLines.push('- Not added yet');
      }
    }

    messageLines.push('');
    messageLines.push('Please share your discounted price and delivery timeline.');

    const normalizedWhatsappNumber = WHATSAPP_QUOTE_NUMBER.length === 10 ? `91${WHATSAPP_QUOTE_NUMBER}` : WHATSAPP_QUOTE_NUMBER;
    const whatsappText = encodeURIComponent(messageLines.join('\n'));
    const whatsappUrl = `https://wa.me/${normalizedWhatsappNumber}?text=${whatsappText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const getValidColor = (color) => {
    const normalizedColor = tinycolor(color);
    return normalizedColor.isValid() ? normalizedColor.toHexString() : '#cccccc';
  };

  const handleWishlistToggle = async () => {
    try {
        const token = localStorage.getItem('userToken'); // Get the token from localStorage
        const userId = user?._id; // Get the user ID
        console.log("frontend from details user id", userId);
        console.log("frontend from details product id", productFetchId);
        console.log("frontend from details token", token);

        const response = await fetch(`${API_BASE_URL}/api/wishlist/${userId}/${productFetchId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Use the token from localStorage
            },
            body: JSON.stringify({ productId: productFetchId }), // Ensure the body contains the productId
        });

        if (response.ok) {
            toast.success('Added to wishlist!');
        } else {
            const data = await response.json();
            toast.error(data.msg);
        }
    } catch (error) {
        toast.error('Error adding to wishlist');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-black"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500 text-xl">Error: {error}</p>
    </div>
  );

  const discountPercent = selectedProduct?.price && selectedProduct?.discountPrice && selectedProduct.price !== selectedProduct.discountPrice
    ? Math.round(((selectedProduct.price - selectedProduct.discountPrice) / selectedProduct.price) * 100)
    : 0;

  const productImages = selectedProduct?.images || [];
  const formatLabel = (value) => (value ? `${value}`.charAt(0).toUpperCase() + `${value}`.slice(1) : 'Not selected');
  const selectedSizeLabel = isCustomSizeSelected
    ? savedCustomMeasurements
      ? 'Custom Size'
      : 'Custom Size (add measurements)'
    : selectedSize || 'Select a size';
  const customMeasurementSummary = savedCustomMeasurements
    ? CUSTOM_MEASUREMENT_FIELDS.map((field) => ({
        id: field.id,
        shortLabel: field.shortLabel,
        value: formatCustomMeasurementValue(savedCustomMeasurements[field.id]),
      }))
    : [];

  return (
    <div className="bg-slate-50 min-h-screen">
      {selectedProduct && (
        <>
          <div className="max-w-7xl mx-auto px-3 lg:px-6 py-3 lg:py-6">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg">
            <div className="flex flex-col lg:flex-row">
              {/* Left: Image Gallery (Professional Desktop) */}
              <div className="lg:w-[55%] lg:sticky lg:top-2 lg:self-start flex lg:flex-row flex-col gap-0 bg-gradient-to-br from-slate-100 via-white to-slate-50 p-3 lg:p-5">
                {/* Desktop: Vertical thumbnail strip + main image */}
                <div className="hidden lg:flex flex-col gap-2.5 items-center justify-start mr-4 mt-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setMainImage(image.url)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border transition-all duration-150 flex items-center justify-center bg-white ${
                        mainImage === image.url ? 'border-indigo-500 shadow-md scale-105' : 'border-gray-200 hover:border-indigo-300'
                      }`}
                      style={{ outline: 'none' }}
                    >
                      <img src={image.url} alt={`Thumb ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                {/* Desktop: Main image */}
                <div className="hidden lg:flex items-center justify-center flex-1">
                  <div
                    className="relative mt-2"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <img
                      ref={imgRef}
                      src={mainImage}
                      alt="Main Product"
                      className="rounded-2xl border border-indigo-100 shadow-xl bg-white"
                      style={{ maxWidth: '400px', maxHeight: '480px', aspectRatio: '3/4', objectFit: 'cover' }}
                    />
                    {/* Zoom on hover (optional, keep as before) */}
                    {showZoomedView && !isMobile && (
                      <div
                        className="fixed z-50 pointer-events-none border border-gray-200 rounded-lg bg-white shadow-lg"
                        style={{
                          left: magnifierPosition.x + magnifierSize + 20,
                          top: magnifierPosition.y - 100,
                          width: '400px',
                          height: '400px',
                          backgroundImage: `url(${mainImage})`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: `${x * 100}% ${y * 100}%`,
                          backgroundSize: `${ZOOM_LEVEL * 100}%`,
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Mobile: Single image with thumbnails (unchanged) */}
                <div className="lg:hidden">
                  <div className="relative">
                    <img
                      ref={imgRef}
                      src={mainImage}
                      alt="Main Product"
                      className="w-full aspect-[3/4] object-cover bg-gray-50 rounded-xl border border-indigo-100 shadow-md"
                    />
                    <div className="button-container absolute top-3 right-3 flex gap-2 z-10">
                      <button onClick={handleWishlistToggle} className="p-2.5 bg-white/95 border border-indigo-100 rounded-full shadow-md hover:bg-indigo-50 transition-colors">
                        <Heart className="w-5 h-5 text-indigo-600" strokeWidth={1.5} />
                      </button>
                      <button onClick={handleShare} className="p-2.5 bg-white/95 border border-indigo-100 rounded-full shadow-md hover:bg-indigo-50 transition-colors">
                        <Share2 className="w-5 h-5 text-indigo-600" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                  {/* Mobile thumbnail strip */}
                  {productImages.length > 1 && (
                    <div className="flex gap-1 p-2 overflow-x-auto">
                      {productImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setMainImage(image.url)}
                          className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 ${
                            mainImage === image.url ? 'border-black' : 'border-transparent'
                          }`}
                        >
                          <img src={image.url} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Product Info */}
              <div className="lg:w-[45%] px-3 lg:px-6 py-3.5 lg:py-5 bg-white">
                {/* Desktop wishlist + share */}
                <div className="hidden lg:flex justify-end gap-2 mb-2">
                  <button onClick={handleWishlistToggle} className="p-2 rounded-full border border-indigo-100 bg-white hover:bg-indigo-50 transition-colors">
                    <Heart className="w-5 h-5 text-indigo-600" strokeWidth={1.5} />
                  </button>
                  <button onClick={handleShare} className="p-2 rounded-full border border-indigo-100 bg-white hover:bg-indigo-50 transition-colors">
                    <Share2 className="w-5 h-5 text-indigo-600" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="mb-2.5 pb-2.5 border-b border-gray-100">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-indigo-600 font-semibold mb-0.5">Signature Edit</p>

                {/* Brand */}
                {selectedProduct.brand && (
                  <h2 className="text-xl lg:text-2xl font-serif text-slate-900 mb-0.5">{selectedProduct.brand}</h2>
                )}
                
                {/* Name */}
                <h1 className="text-base lg:text-lg text-slate-600 mb-1 leading-snug">{selectedProduct.name}</h1>

                {/* Thrift badge */}
                {selectedProduct.thrift && (
                  <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[11px] font-semibold px-3 py-1 mb-2 rounded-full shadow-[0_6px_18px_rgba(16,185,129,0.35)] ring-1 ring-emerald-300/60">
                    ♻ Thrift
                  </span>
                )}

                {/* Rating */}
                {selectedProduct.rating > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {selectedProduct.rating} ★
                    </span>
                    {selectedProduct.numReviews > 0 && (
                      <span className="text-xs text-gray-400">{selectedProduct.numReviews} Ratings</span>
                    )}
                  </div>
                )}
                </div>

                {/* Divider */}
                <hr className="border-gray-100 my-2" />

                {/* Price */}
                <div className="mb-2.5 bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-100 rounded-xl p-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[28px] lg:text-[30px] font-extrabold text-gray-900">₹{selectedProduct.discountPrice}</span>
                    {selectedProduct.price && selectedProduct.price !== selectedProduct.discountPrice && (
                      <>
                        <span className="text-xs text-gray-400 line-through">MRP ₹{selectedProduct.price}</span>
                        {discountPercent > 0 && (
                          <span className="text-xs font-bold text-indigo-600">({discountPercent}% OFF)</span>
                        )}
                      </>
                    )}
                  </div>
                  <p className="text-xs text-indigo-600 font-medium mt-0.5">inclusive of all taxes</p>
                </div>

                {/* Color Selection */}
                {selectedProduct.colors?.length > 0 && (
                  <div className="mb-2.5 border border-indigo-100 bg-white rounded-xl p-2.5">
                    <p className="text-[15px] font-semibold text-gray-900 mb-1.5">
                      Color: <span className="font-normal text-gray-500">{formatLabel(selectedColor)}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.colors.map((color) => {
                        const validColor = getValidColor(color);
                        const isWhite = tinycolor(color).getBrightness() > 240;
                        return (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-8 h-8 rounded-full transition-all relative ${
                              selectedColor === color
                                ? 'ring-2 ring-offset-1 ring-indigo-600 scale-105'
                                : isWhite ? 'border border-gray-300 hover:ring-2 hover:ring-offset-1 hover:ring-indigo-200' : 'hover:ring-2 hover:ring-offset-1 hover:ring-indigo-200'
                            }`}
                            style={{ backgroundColor: validColor }}
                            title={color}
                          >
                            {selectedColor === color && (
                              <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${
                                tinycolor(color).isDark() ? 'text-white' : 'text-black'
                              }`}>✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                {selectedProduct.sizes?.length > 0 && (
                  <div className="mb-2.5 border border-slate-200 bg-white rounded-xl p-2.5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[15px] font-semibold text-gray-900">
                        Size: <span className="font-normal text-gray-500">{selectedSizeLabel}</span>
                      </p>
                      <button
                        onClick={() => setIsSizeChartModalOpen(true)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-indigo-300 bg-indigo-50 text-indigo-700 text-[11px] font-semibold hover:bg-indigo-100"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View Size Chart
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProduct.sizes.filter((size) => size !== CUSTOM_SIZE_VALUE).map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[40px] h-7 px-2 rounded-md text-xs leading-none font-semibold transition-all ${
                            selectedSize === size
                              ? 'bg-sky-50 text-slate-900 border-2 border-blue-600 shadow-[0_0_0_1px_rgba(37,99,235,0.12)]'
                              : 'bg-white border border-slate-300 text-slate-800 hover:border-slate-500'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                      <button
                        onClick={openCustomSizeModal}
                        className={`h-7 px-2.5 rounded-md text-[11px] leading-none font-semibold transition-all inline-flex items-center gap-1 ${
                          isCustomSizeSelected
                            ? 'bg-gradient-to-r from-slate-900 to-indigo-900 text-white border border-slate-900 shadow-sm'
                            : 'bg-white border border-indigo-300 text-indigo-700 hover:border-indigo-500 hover:bg-indigo-50'
                        }`}
                      >
                        <CustomSizeIcon className="w-3.5 h-3.5" />
                        Custom Size
                      </button>
                    </div>

                    {isCustomSizeSelected && (
                      <div className="mt-2 rounded-xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50 p-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.14em] text-indigo-600 font-semibold">Custom Size Profile</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {savedCustomMeasurements ? 'Measurements saved for this item.' : 'Add all required measurements to continue.'}
                            </p>
                          </div>
                          <button
                            onClick={openCustomSizeModal}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-md border border-indigo-300 text-indigo-700 bg-white hover:bg-indigo-50"
                          >
                            {savedCustomMeasurements ? 'Edit' : 'Add'}
                          </button>
                        </div>

                        {savedCustomMeasurements && (
                          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                            {customMeasurementSummary.map((entry) => (
                              <div key={entry.id} className="rounded-md border border-indigo-100 bg-white/95 px-2 py-1.5">
                                <div className="flex items-center justify-between gap-2">
                                  <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">{entry.shortLabel}</p>
                                  <div className="flex items-baseline gap-1">
                                    <p className="text-[13px] leading-none font-semibold text-slate-900">{entry.value}</p>
                                    <span className="text-[10px] leading-none font-semibold uppercase tracking-[0.04em] text-slate-500">in</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {isSizeChartModalOpen && (
                  <div className="fixed inset-0 z-[85] bg-slate-900/60 backdrop-blur-[2px] px-3 py-5 lg:py-8 overflow-y-auto">
                    <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-[0_30px_90px_rgba(15,23,42,0.35)] overflow-hidden">
                      <div className="px-4 lg:px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-indigo-200 font-semibold">Size Guidance</p>
                          <h3 className="text-lg lg:text-xl font-semibold mt-1">India Size Chart (Measurements in Inches)</h3>
                          <p className="text-xs text-indigo-100/90 mt-1">Use this chart to choose your base size before entering custom measurements.</p>
                        </div>
                        <button
                          onClick={() => setIsSizeChartModalOpen(false)}
                          className="h-9 w-9 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 flex items-center justify-center"
                          aria-label="Close size chart modal"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="px-4 lg:px-6 py-4 lg:py-5 bg-slate-50">
                        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                          <img
                            src={customGuideSizeChart}
                            alt="India size chart in inches"
                            className="w-full h-auto object-cover"
                            loading="lazy"
                          />
                        </div>
                        <p className="mt-3 text-xs text-slate-500">
                          Tip: For made-to-order pieces, use this chart as a base and then refine fit using the custom measurement fields.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isCustomSizeModalOpen && (
                  <div className="fixed inset-0 z-[80] bg-slate-900/55 backdrop-blur-[2px] px-3 py-5 lg:py-8 overflow-y-auto">
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-[0_30px_90px_rgba(15,23,42,0.35)] overflow-hidden">
                      <div className="px-4 lg:px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-indigo-200 font-semibold">Tailored For You</p>
                          <h3 className="text-lg lg:text-xl font-semibold mt-1">Custom Size Measurements</h3>
                          <p className="text-xs text-indigo-100/90 mt-1">Fill all measurements in inches for a precise made-to-order fit.</p>
                        </div>
                        <button
                          onClick={() => setIsCustomSizeModalOpen(false)}
                          className="h-9 w-9 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 flex items-center justify-center"
                          aria-label="Close custom measurements modal"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="px-4 lg:px-6 py-4 lg:py-5">
                        <div className="mb-5 border-b border-slate-200 pb-4">
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <p className="text-xs uppercase tracking-[0.16em] text-slate-500 font-semibold">Measurement Reference</p>
                            <p className="text-[11px] text-slate-500">Use these guides before entering your values</p>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm max-w-[780px] mx-auto w-full">
                              <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                                <p className="text-xs font-semibold text-slate-700">How To Measure Guide</p>
                              </div>
                              <img
                                src={customGuideHowToMeasure}
                                alt="How to measure guide for custom size"
                                className="w-full h-auto object-cover"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="hidden sm:grid sm:grid-cols-12 gap-3 px-1 pb-2 border-b border-slate-200 text-[11px] uppercase tracking-[0.14em] text-slate-500 font-semibold">
                          <p className="sm:col-span-3">Measurement Area</p>
                          <p className="sm:col-span-6">Description / How to Measure</p>
                          <p className="sm:col-span-3 text-right">Enter Measurement (in)</p>
                        </div>

                        <div className="divide-y divide-slate-100">
                          {CUSTOM_MEASUREMENT_FIELDS.map((field, inputIndex) => (
                            <div key={field.id} className="grid sm:grid-cols-12 gap-3 py-3 sm:items-center">
                              <div className="sm:col-span-3">
                                <p className="text-sm font-semibold text-slate-900">{field.label}</p>
                              </div>
                              <p className="sm:col-span-6 text-xs text-slate-500 leading-relaxed">{field.description}</p>
                              <div className="sm:col-span-3 sm:justify-self-end w-full sm:w-[150px]">
                                <div className="relative">
                                  <input
                                    ref={(element) => {
                                      measurementInputRefs.current[inputIndex] = element;
                                    }}
                                    type="text"
                                    inputMode="decimal"
                                    value={customMeasurementForm[field.id]}
                                    onChange={(event) => handleCustomMeasurementChange(field.id, event.target.value)}
                                    onKeyDown={(event) => handleMeasurementInputKeyDown(event, inputIndex)}
                                    placeholder={field.placeholder}
                                    className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors ${
                                      customMeasurementErrors[field.id]
                                        ? 'border-rose-400 focus:border-rose-500'
                                        : 'border-slate-300 focus:border-indigo-500'
                                    }`}
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400">in</span>
                                </div>
                                {customMeasurementErrors[field.id] && (
                                  <p className="mt-1 text-[11px] text-rose-600">{customMeasurementErrors[field.id]}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="px-4 lg:px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <p className="text-xs text-slate-500">Tip: Keep the tape snug and level for accurate measurements.</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setIsCustomSizeModalOpen(false)}
                            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-white"
                          >
                            Cancel
                          </button>
                          <button
                            ref={saveMeasurementsButtonRef}
                            onClick={handleSaveCustomMeasurements}
                            className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800"
                          >
                            Save Measurements
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-2.5 border border-slate-200 bg-white rounded-xl p-2.5">
                  <p className="text-[15px] font-semibold text-gray-900 mb-1.5">Qty:</p>
                  <div className="inline-flex items-center border border-gray-200 rounded-full">
                    <button onClick={decreaseQuantity} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-l-full">
                      <Minus className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                    <span className="w-9 text-center text-sm font-semibold">{quantity}</span>
                    <button onClick={increaseQuantity} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-r-full">
                      <Plus className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Prompt to select */}
                {needsSelection && (
                  <p className="text-xs text-rose-600 font-medium mb-2.5">
                    ⚠ Please select {getInlineSelectionPrompt()} to continue
                  </p>
                )}

                {/* Action Buttons */}
                <div className="mb-3 space-y-2.5">
                  <button
                    onClick={handleGetBestPriceOnWhatsApp}
                    disabled={needsSelection}
                    className={`relative w-full py-3.5 px-2 overflow-hidden rounded-md border border-[#c9ad76] bg-gradient-to-r from-[#111111] via-[#1c1c1c] to-[#272522] text-[#f4e7c8] shadow-[0_12px_26px_rgba(0,0,0,0.45)] transition-all ${
                      needsSelection
                        ? 'opacity-55 cursor-not-allowed'
                        : 'hover:from-[#181818] hover:via-[#252525] hover:to-[#312d27] hover:shadow-[0_16px_32px_rgba(0,0,0,0.55)] active:scale-[0.98]'
                    }`}
                  >
                    <span className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#d8bf89]/30 to-transparent" aria-hidden="true"></span>
                    <span className="relative flex items-center justify-center gap-2 text-sm font-semibold tracking-[0.03em]">
                      <span className="relative inline-flex h-6 w-6 shrink-0 rounded-full border border-[#d7ba83] bg-black/25 text-[#6ee7b7]">
                        <FaWhatsapp className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2" />
                      </span>
                      <span>GET DISCOUNTED PRICE</span>
                    </span>
                  </button>

                  <div className="hidden sm:flex gap-2.5">
                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock || isActionBusy}
                      className={`flex-1 py-3.5 items-center justify-center gap-2 text-sm font-semibold tracking-[0.02em] transition-all ${
                        isOutOfStock || isActionBusy
                          ? 'border-2 border-gray-200 text-gray-300 cursor-not-allowed bg-white'
                          : 'border-2 border-lv-dark bg-white text-lv-dark hover:bg-gray-50 hover:shadow-sm active:scale-[0.98]'
                      } inline-flex`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isAddingToCart ? 'ADDING...' : 'ADD TO BAG'}</span>
                    </button>

                    <button
                      onClick={handleBuyNow}
                      disabled={isOutOfStock || isActionBusy}
                      className={`flex-1 py-3.5 items-center justify-center gap-2 text-sm font-semibold tracking-[0.02em] transition-all ${
                        isOutOfStock || isActionBusy
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                          : 'bg-lv-dark text-white hover:bg-lv-dark/90 hover:shadow-sm active:scale-[0.98]'
                      } inline-flex`}
                    >
                      {isBuyingNow ? 'PROCESSING...' : 'BUY NOW'}
                    </button>
                  </div>
                </div>

                {/* Delivery + Returns */}
                <div className="border border-slate-200 bg-white rounded-lg divide-y divide-slate-200 mb-3">
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <Truck className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Free Delivery</p>
                      <p className="text-[10px] text-gray-400">On orders above ₹999</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <RefreshCw className="w-4 h-4 text-fuchsia-500 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Easy Returns</p>
                      <p className="text-[10px] text-gray-400">3 days return & exchange</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedProduct.description && (
                  <div className="mb-3 border border-slate-200 bg-gradient-to-r from-white to-slate-50 rounded-xl p-2.5">
                    <p className="text-[13px] font-semibold text-gray-900 mb-1.5">Product Details</p>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{selectedProduct.description}</p>
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>

          {/* Similar Products */}
          {similarProducts?.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 mt-8 mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-2xl tracking-wide text-slate-900">You May Also Like</h2>
                <span className="text-xs uppercase tracking-[0.2em] text-fuchsia-600">Curated for you</span>
              </div>
              <ProductGrid products={similarProducts} />
            </div>
          )}

          {/* Mobile sticky bottom bar */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40 flex gap-3 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isActionBusy}
              className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                isOutOfStock || isActionBusy
                  ? 'border-2 border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-2 border-black text-black active:scale-[0.98]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {isAddingToCart ? 'ADDING...' : 'ADD TO BAG'}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock || isActionBusy}
              className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                isOutOfStock || isActionBusy
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : 'bg-yellow-400 text-black active:scale-[0.98]'
              }`}
            >
              {isBuyingNow ? 'PROCESSING...' : 'BUY NOW'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetails;
