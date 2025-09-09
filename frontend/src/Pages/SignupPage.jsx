import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sprout,
  ArrowRight,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
} from "lucide-react";
import "../Styles/LoginSignup.css";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "../stores/useAuthStore";

const SignupPage = () => {
  const {signup}=useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    emailPhone: "",
    password: "",
    confirmPassword: "",
    state: "",
    district: "",
  });

  const [inputType, setInputType] = useState("email");
  const [errors, setErrors] = useState({});

  // States in India
  const states = [
    {
      state: "Andhra Pradesh",
      districts: [
        "Anantapur",
        "Chittoor",
        "East Godavari",
        "Guntur",
        "Krishna",
        "Kurnool",
        "Nellore",
        "Prakasam",
        "Srikakulam",
        "Visakhapatnam",
        "Vizianagaram",
        "West Godavari",
        "YSR Kadapa",
      ],
    },
    {
      state: "Arunachal Pradesh",
      districts: [
        "Tawang",
        "West Kameng",
        "East Kameng",
        "Papum Pare",
        "Kurung Kumey",
        "Kra Daadi",
        "Lower Subansiri",
        "Upper Subansiri",
        "West Siang",
        "East Siang",
        "Siang",
        "Upper Siang",
        "Lower Siang",
        "Lower Dibang Valley",
        "Dibang Valley",
        "Anjaw",
        "Lohit",
        "Namsai",
        "Changlang",
        "Tirap",
        "Longding",
      ],
    },
    {
      state: "Assam",
      districts: [
        "Baksa",
        "Barpeta",
        "Biswanath",
        "Bongaigaon",
        "Cachar",
        "Charaideo",
        "Chirang",
        "Darrang",
        "Dhemaji",
        "Dhubri",
        "Dibrugarh",
        "Goalpara",
        "Golaghat",
        "Hailakandi",
        "Hojai",
        "Jorhat",
        "Kamrup Metropolitan",
        "Kamrup",
        "Karbi Anglong",
        "Karimganj",
        "Kokrajhar",
        "Lakhimpur",
        "Majuli",
        "Morigaon",
        "Nagaon",
        "Nalbari",
        "Dima Hasao",
        "Sivasagar",
        "Sonitpur",
        "South Salmara-Mankachar",
        "Tinsukia",
        "Udalguri",
        "West Karbi Anglong",
      ],
    },
    {
      state: "Bihar",
      districts: [
        "Araria",
        "Arwal",
        "Aurangabad",
        "Banka",
        "Begusarai",
        "Bhagalpur",
        "Bhojpur",
        "Buxar",
        "Darbhanga",
        "East Champaran (Motihari)",
        "Gaya",
        "Gopalganj",
        "Jamui",
        "Jehanabad",
        "Kaimur (Bhabua)",
        "Katihar",
        "Khagaria",
        "Kishanganj",
        "Lakhisarai",
        "Madhepura",
        "Madhubani",
        "Munger (Monghyr)",
        "Muzaffarpur",
        "Nalanda",
        "Nawada",
        "Patna",
        "Purnia (Purnea)",
        "Rohtas",
        "Saharsa",
        "Samastipur",
        "Saran",
        "Sheikhpura",
        "Sheohar",
        "Sitamarhi",
        "Siwan",
        "Supaul",
        "Vaishali",
        "West Champaran",
      ],
    },
    {
      state: "Chandigarh (UT)",
      districts: ["Chandigarh"],
    },
    {
      state: "Chhattisgarh",
      districts: [
        "Balod",
        "Baloda Bazar",
        "Balrampur",
        "Bastar",
        "Bemetara",
        "Bijapur",
        "Bilaspur",
        "Dantewada (South Bastar)",
        "Dhamtari",
        "Durg",
        "Gariyaband",
        "Janjgir-Champa",
        "Jashpur",
        "Kabirdham (Kawardha)",
        "Kanker (North Bastar)",
        "Kondagaon",
        "Korba",
        "Korea (Koriya)",
        "Mahasamund",
        "Mungeli",
        "Narayanpur",
        "Raigarh",
        "Raipur",
        "Rajnandgaon",
        "Sukma",
        "Surajpur  ",
        "Surguja",
      ],
    },
    {
      state: "Dadra and Nagar Haveli (UT)",
      districts: ["Dadra & Nagar Haveli"],
    },
    {
      state: "Daman and Diu (UT)",
      districts: ["Daman", "Diu"],
    },
    {
      state: "Delhi (NCT)",
      districts: [
        "Central Delhi",
        "East Delhi",
        "New Delhi",
        "North Delhi",
        "North East  Delhi",
        "North West  Delhi",
        "Shahdara",
        "South Delhi",
        "South East Delhi",
        "South West  Delhi",
        "West Delhi",
      ],
    },
    {
      state: "Goa",
      districts: ["North Goa", "South Goa"],
    },
    {
      state: "Gujarat",
      districts: [
        "Ahmedabad",
        "Amreli",
        "Anand",
        "Aravalli",
        "Banaskantha (Palanpur)",
        "Bharuch",
        "Bhavnagar",
        "Botad",
        "Chhota Udepur",
        "Dahod",
        "Dangs (Ahwa)",
        "Devbhoomi Dwarka",
        "Gandhinagar",
        "Gir Somnath",
        "Jamnagar",
        "Junagadh",
        "Kachchh",
        "Kheda (Nadiad)",
        "Mahisagar",
        "Mehsana",
        "Morbi",
        "Narmada (Rajpipla)",
        "Navsari",
        "Panchmahal (Godhra)",
        "Patan",
        "Porbandar",
        "Rajkot",
        "Sabarkantha (Himmatnagar)",
        "Surat",
        "Surendranagar",
        "Tapi (Vyara)",
        "Vadodara",
        "Valsad",
      ],
    },
    {
      state: "Haryana",
      districts: [
        "Ambala",
        "Bhiwani",
        "Charkhi Dadri",
        "Faridabad",
        "Fatehabad",
        "Gurgaon",
        "Hisar",
        "Jhajjar",
        "Jind",
        "Kaithal",
        "Karnal",
        "Kurukshetra",
        "Mahendragarh",
        "Mewat",
        "Palwal",
        "Panchkula",
        "Panipat",
        "Rewari",
        "Rohtak",
        "Sirsa",
        "Sonipat",
        "Yamunanagar",
      ],
    },
    {
      state: "Himachal Pradesh",
      districts: [
        "Bilaspur",
        "Chamba",
        "Hamirpur",
        "Kangra",
        "Kinnaur",
        "Kullu",
        "Lahaul &amp; Spiti",
        "Mandi",
        "Shimla",
        "Sirmaur (Sirmour)",
        "Solan",
        "Una",
      ],
    },
    {
      state: "Jammu and Kashmir",
      districts: [
        "Anantnag",
        "Bandipore",
        "Baramulla",
        "Budgam",
        "Doda",
        "Ganderbal",
        "Jammu",
        "Kargil",
        "Kathua",
        "Kishtwar",
        "Kulgam",
        "Kupwara",
        "Leh",
        "Poonch",
        "Pulwama",
        "Rajouri",
        "Ramban",
        "Reasi",
        "Samba",
        "Shopian",
        "Srinagar",
        "Udhampur",
      ],
    },
    {
      state: "Jharkhand",
      districts: [
        "Bokaro",
        "Chatra",
        "Deoghar",
        "Dhanbad",
        "Dumka",
        "East Singhbhum",
        "Garhwa",
        "Giridih",
        "Godda",
        "Gumla",
        "Hazaribag",
        "Jamtara",
        "Khunti",
        "Koderma",
        "Latehar",
        "Lohardaga",
        "Pakur",
        "Palamu",
        "Ramgarh",
        "Ranchi",
        "Sahibganj",
        "Seraikela-Kharsawan",
        "Simdega",
        "West Singhbhum",
      ],
    },
    {
      state: "Karnataka",
      districts: [
        "Bagalkot",
        "Ballari (Bellary)",
        "Belagavi (Belgaum)",
        "Bengaluru (Bangalore) Rural",
        "Bengaluru (Bangalore) Urban",
        "Bidar",
        "Chamarajanagar",
        "Chikballapur",
        "Chikkamagaluru (Chikmagalur)",
        "Chitradurga",
        "Dakshina Kannada",
        "Davangere",
        "Dharwad",
        "Gadag",
        "Hassan",
        "Haveri",
        "Kalaburagi (Gulbarga)",
        "Kodagu",
        "Kolar",
        "Koppal",
        "Mandya",
        "Mysuru (Mysore)",
        "Raichur",
        "Ramanagara",
        "Shivamogga (Shimoga)",
        "Tumakuru (Tumkur)",
        "Udupi",
        "Uttara Kannada (Karwar)",
        "Vijayapura (Bijapur)",
        "Yadgir",
      ],
    },
    {
      state: "Kerala",
      districts: [
        "Alappuzha",
        "Ernakulam",
        "Idukki",
        "Kannur",
        "Kasaragod",
        "Kollam",
        "Kottayam",
        "Kozhikode",
        "Malappuram",
        "Palakkad",
        "Pathanamthitta",
        "Thiruvananthapuram",
        "Thrissur",
        "Wayanad",
      ],
    },
    {
      state: "Lakshadweep (UT)",
      districts: [
        "Agatti",
        "Amini",
        "Androth",
        "Bithra",
        "Chethlath",
        "Kavaratti",
        "Kadmath",
        "Kalpeni",
        "Kilthan",
        "Minicoy",
      ],
    },
    {
      state: "Madhya Pradesh",
      districts: [
        "Agar Malwa",
        "Alirajpur",
        "Anuppur",
        "Ashoknagar",
        "Balaghat",
        "Barwani",
        "Betul",
        "Bhind",
        "Bhopal",
        "Burhanpur",
        "Chhatarpur",
        "Chhindwara",
        "Damoh",
        "Datia",
        "Dewas",
        "Dhar",
        "Dindori",
        "Guna",
        "Gwalior",
        "Harda",
        "Hoshangabad",
        "Indore",
        "Jabalpur",
        "Jhabua",
        "Katni",
        "Khandwa",
        "Khargone",
        "Mandla",
        "Mandsaur",
        "Morena",
        "Narsinghpur",
        "Neemuch",
        "Panna",
        "Raisen",
        "Rajgarh",
        "Ratlam",
        "Rewa",
        "Sagar",
        "Satna",
        "Sehore",
        "Seoni",
        "Shahdol",
        "Shajapur",
        "Sheopur",
        "Shivpuri",
        "Sidhi",
        "Singrauli",
        "Tikamgarh",
        "Ujjain",
        "Umaria",
        "Vidisha",
      ],
    },
    {
      state: "Maharashtra",
      districts: [
        "Ahmednagar",
        "Akola",
        "Amravati",
        "Aurangabad",
        "Beed",
        "Bhandara",
        "Buldhana",
        "Chandrapur",
        "Dhule",
        "Gadchiroli",
        "Gondia",
        "Hingoli",
        "Jalgaon",
        "Jalna",
        "Kolhapur",
        "Latur",
        "Mumbai City",
        "Mumbai Suburban",
        "Nagpur",
        "Nanded",
        "Nandurbar",
        "Nashik",
        "Osmanabad",
        "Palghar",
        "Parbhani",
        "Pune",
        "Raigad",
        "Ratnagiri",
        "Sangli",
        "Satara",
        "Sindhudurg",
        "Solapur",
        "Thane",
        "Wardha",
        "Washim",
        "Yavatmal",
      ],
    },
    {
      state: "Manipur",
      districts: [
        "Bishnupur",
        "Chandel",
        "Churachandpur",
        "Imphal East",
        "Imphal West",
        "Jiribam",
        "Kakching",
        "Kamjong",
        "Kangpokpi",
        "Noney",
        "Pherzawl",
        "Senapati",
        "Tamenglong",
        "Tengnoupal",
        "Thoubal",
        "Ukhrul",
      ],
    },
    {
      state: "Meghalaya",
      districts: [
        "East Garo Hills",
        "East Jaintia Hills",
        "East Khasi Hills",
        "North Garo Hills",
        "Ri Bhoi",
        "South Garo Hills",
        "South West Garo Hills ",
        "South West Khasi Hills",
        "West Garo Hills",
        "West Jaintia Hills",
        "West Khasi Hills",
      ],
    },
    {
      state: "Mizoram",
      districts: [
        "Aizawl",
        "Champhai",
        "Kolasib",
        "Lawngtlai",
        "Lunglei",
        "Mamit",
        "Saiha",
        "Serchhip",
      ],
    },
    {
      state: "Nagaland",
      districts: [
        "Dimapur",
        "Kiphire",
        "Kohima",
        "Longleng",
        "Mokokchung",
        "Mon",
        "Peren",
        "Phek",
        "Tuensang",
        "Wokha",
        "Zunheboto",
      ],
    },
    {
      state: "Odisha",
      districts: [
        "Angul",
        "Balangir",
        "Balasore",
        "Bargarh",
        "Bhadrak",
        "Boudh",
        "Cuttack",
        "Deogarh",
        "Dhenkanal",
        "Gajapati",
        "Ganjam",
        "Jagatsinghapur",
        "Jajpur",
        "Jharsuguda",
        "Kalahandi",
        "Kandhamal",
        "Kendrapara",
        "Kendujhar (Keonjhar)",
        "Khordha",
        "Koraput",
        "Malkangiri",
        "Mayurbhanj",
        "Nabarangpur",
        "Nayagarh",
        "Nuapada",
        "Puri",
        "Rayagada",
        "Sambalpur",
        "Sonepur",
        "Sundargarh",
      ],
    },
    {
      state: "Puducherry (UT)",
      districts: ["Karaikal", "Mahe", "Pondicherry", "Yanam"],
    },
    {
      state: "Punjab",
      districts: [
        "Amritsar",
        "Barnala",
        "Bathinda",
        "Faridkot",
        "Fatehgarh Sahib",
        "Fazilka",
        "Ferozepur",
        "Gurdaspur",
        "Hoshiarpur",
        "Jalandhar",
        "Kapurthala",
        "Ludhiana",
        "Mansa",
        "Moga",
        "Muktsar",
        "Nawanshahr (Shahid Bhagat Singh Nagar)",
        "Pathankot",
        "Patiala",
        "Rupnagar",
        "Sahibzada Ajit Singh Nagar (Mohali)",
        "Sangrur",
        "Tarn Taran",
      ],
    },
    {
      state: "Rajasthan",
      districts: [
        "Ajmer",
        "Alwar",
        "Banswara",
        "Baran",
        "Barmer",
        "Bharatpur",
        "Bhilwara",
        "Bikaner",
        "Bundi",
        "Chittorgarh",
        "Churu",
        "Dausa",
        "Dholpur",
        "Dungarpur",
        "Hanumangarh",
        "Jaipur",
        "Jaisalmer",
        "Jalore",
        "Jhalawar",
        "Jhunjhunu",
        "Jodhpur",
        "Karauli",
        "Kota",
        "Nagaur",
        "Pali",
        "Pratapgarh",
        "Rajsamand",
        "Sawai Madhopur",
        "Sikar",
        "Sirohi",
        "Sri Ganganagar",
        "Tonk",
        "Udaipur",
      ],
    },
    {
      state: "Sikkim",
      districts: ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
    },
    {
      state: "Tamil Nadu",
      districts: [
        "Ariyalur",
        "Chennai",
        "Coimbatore",
        "Cuddalore",
        "Dharmapuri",
        "Dindigul",
        "Erode",
        "Kanchipuram",
        "Kanyakumari",
        "Karur",
        "Krishnagiri",
        "Madurai",
        "Nagapattinam",
        "Namakkal",
        "Nilgiris",
        "Perambalur",
        "Pudukkottai",
        "Ramanathapuram",
        "Salem",
        "Sivaganga",
        "Thanjavur",
        "Theni",
        "Thoothukudi (Tuticorin)",
        "Tiruchirappalli",
        "Tirunelveli",
        "Tiruppur",
        "Tiruvallur",
        "Tiruvannamalai",
        "Tiruvarur",
        "Vellore",
        "Viluppuram",
        "Virudhunagar",
      ],
    },
    {
      state: "Telangana",
      districts: [
        "Adilabad",
        "Bhadradri Kothagudem",
        "Hyderabad",
        "Jagtial",
        "Jangaon",
        "Jayashankar Bhoopalpally",
        "Jogulamba Gadwal",
        "Kamareddy",
        "Karimnagar",
        "Khammam",
        "Komaram Bheem Asifabad",
        "Mahabubabad",
        "Mahabubnagar",
        "Mancherial",
        "Medak",
        "Medchal",
        "Nagarkurnool",
        "Nalgonda",
        "Nirmal",
        "Nizamabad",
        "Peddapalli",
        "Rajanna Sircilla",
        "Rangareddy",
        "Sangareddy",
        "Siddipet",
        "Suryapet",
        "Vikarabad",
        "Wanaparthy",
        "Warangal (Rural)",
        "Warangal (Urban)",
        "Yadadri Bhuvanagiri",
      ],
    },
    {
      state: "Tripura",
      districts: [
        "Dhalai",
        "Gomati",
        "Khowai",
        "North Tripura",
        "Sepahijala",
        "South Tripura",
        "Unakoti",
        "West Tripura",
      ],
    },
    {
      state: "Uttarakhand",
      districts: [
        "Almora",
        "Bageshwar",
        "Chamoli",
        "Champawat",
        "Dehradun",
        "Haridwar",
        "Nainital",
        "Pauri Garhwal",
        "Pithoragarh",
        "Rudraprayag",
        "Tehri Garhwal",
        "Udham Singh Nagar",
        "Uttarkashi",
      ],
    },
    {
      state: "Uttar Pradesh",
      districts: [
        "Agra",
        "Aligarh",
        "Allahabad",
        "Ambedkar Nagar",
        "Amethi (Chatrapati Sahuji Mahraj Nagar)",
        "Amroha (J.P. Nagar)",
        "Auraiya",
        "Azamgarh",
        "Baghpat",
        "Bahraich",
        "Ballia",
        "Balrampur",
        "Banda",
        "Barabanki",
        "Bareilly",
        "Basti",
        "Bhadohi",
        "Bijnor",
        "Budaun",
        "Bulandshahr",
        "Chandauli",
        "Chitrakoot",
        "Deoria",
        "Etah",
        "Etawah",
        "Faizabad",
        "Farrukhabad",
        "Fatehpur",
        "Firozabad",
        "Gautam Buddha Nagar",
        "Ghaziabad",
        "Ghazipur",
        "Gonda",
        "Gorakhpur",
        "Hamirpur",
        "Hapur (Panchsheel Nagar)",
        "Hardoi",
        "Hathras",
        "Jalaun",
        "Jaunpur",
        "Jhansi",
        "Kannauj",
        "Kanpur Dehat",
        "Kanpur Nagar",
        "Kanshiram Nagar (Kasganj)",
        "Kaushambi",
        "Kushinagar (Padrauna)",
        "Lakhimpur - Kheri",
        "Lalitpur",
        "Lucknow",
        "Maharajganj",
        "Mahoba",
        "Mainpuri",
        "Mathura",
        "Mau",
        "Meerut",
        "Mirzapur",
        "Moradabad",
        "Muzaffarnagar",
        "Pilibhit",
        "Pratapgarh",
        "RaeBareli",
        "Rampur",
        "Saharanpur",
        "Sambhal (Bhim Nagar)",
        "Sant Kabir Nagar",
        "Shahjahanpur",
        "Shamali (Prabuddh Nagar)",
        "Shravasti",
        "Siddharth Nagar",
        "Sitapur",
        "Sonbhadra",
        "Sultanpur",
        "Unnao",
        "Varanasi",
      ],
    },
    {
      state: "West Bengal",
      districts: [
        "Alipurduar",
        "Bankura",
        "Birbhum",
        "Burdwan (Bardhaman)",
        "Cooch Behar",
        "Dakshin Dinajpur (South Dinajpur)",
        "Darjeeling",
        "Hooghly",
        "Howrah",
        "Jalpaiguri",
        "Kalimpong",
        "Kolkata",
        "Malda",
        "Murshidabad",
        "Nadia",
        "North 24 Parganas",
        "Paschim Medinipur (West Medinipur)",
        "Purba Medinipur (East Medinipur)",
        "Purulia",
        "South 24 Parganas",
        "Uttar Dinajpur (North Dinajpur)",
      ],
    },
  ];

  // Get districts for a state
  const getDistrictsForState = (stateName) => {
    const stateObj = states.find((s) => s.state === stateName);
    return stateObj ? stateObj.districts : [];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear the error when user starts typing again
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    // Reset district when state changes
    if (name === "state") {
      setFormData((prev) => ({
        ...prev,
        district: "",
      }));
    }
  };

  const toggleInputType = () => {
    setInputType(inputType === "email" ? "tel" : "email");
    setFormData({
      ...formData,
      emailPhone: "",
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Validate email/phone
    if (!formData.emailPhone) {
      newErrors.emailPhone = `${
        inputType === "email" ? "Email" : "Phone number"
      } is required`;
    } else if (
      inputType === "email" &&
      !/\S+@\S+\.\S+/.test(formData.emailPhone)
    ) {
      newErrors.emailPhone = "Please enter a valid email address";
    } else if (inputType === "tel" && !/^\d{10}$/.test(formData.emailPhone)) {
      newErrors.emailPhone = "Please enter a valid 10-digit phone number";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Validate state
    if (!formData.state) {
      newErrors.state = "Please select your state";
    }

    // Validate district
    if (formData.state && !formData.district) {
      newErrors.district = "Please select your district";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // In the handleSubmit function:
const handleSubmit = (e) => {
  e.preventDefault();

  if (validateForm()) {
    // Prepare the data in the format your API expects
    const signupData = {
      name: formData.name,
      password: formData.password,
      state: formData.state,
      district: formData.district
    };
    
    // Add either email or phone based on the input type
    if (inputType === "email") {
      signupData.email = formData.emailPhone;
    } else {
      signupData.phone = formData.emailPhone;
    }
    
    // Call the signup function with the properly formatted data
    signup(signupData);
  }
};

  // Get state names for the dropdown
  const stateNames = states.map((stateObj) => stateObj.state);

  return (
    <div className="auth-page signup-page">
      <Toaster/>
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <Sprout className="logo-icon" />
              <span className="logo-text">FarmConnect</span>
            </Link>
            <h1 className="auth-title">Create Your Account</h1>
            <p className="auth-subtitle">
              Join thousands of farmers using FarmConnect to improve yields and
              make data-driven decisions.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <User size={16} className="input-icon" />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className={`form-input ${errors.name ? "error" : ""}`}
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <div className="input-toggle-header">
                <label htmlFor="emailPhone" className="form-label">
                  {inputType === "email" ? (
                    <Mail size={16} className="input-icon" />
                  ) : (
                    <Phone size={16} className="input-icon" />
                  )}
                  {inputType === "email" ? "Email Address" : "Phone Number"}
                </label>
                <button
                  type="button"
                  className="toggle-input-btn"
                  onClick={toggleInputType}
                >
                  Switch to {inputType === "email" ? "Phone" : "Email"}
                </button>
              </div>
              <input
                type={inputType}
                id="emailPhone"
                name="emailPhone"
                className={`form-input ${errors.emailPhone ? "error" : ""}`}
                placeholder={
                  inputType === "email"
                    ? "Enter your email address"
                    : "Enter your phone number"
                }
                value={formData.emailPhone}
                onChange={handleChange}
              />
              {errors.emailPhone && (
                <span className="error-message">{errors.emailPhone}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <Lock size={16} className="input-icon" />
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-input ${errors.password ? "error" : ""}`}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <Lock size={16} className="input-icon" />
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`form-input ${
                  errors.confirmPassword ? "error" : ""
                }`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="state" className="form-label">
                  <MapPin size={16} className="input-icon" />
                  State
                </label>
                <select
                  id="state"
                  name="state"
                  className={`form-input form-select ${
                    errors.state ? "error" : ""
                  }`}
                  value={formData.state}
                  onChange={handleChange}
                >
                  <option value="">Select State</option>
                  {stateNames.map((stateName) => (
                    <option key={stateName} value={stateName}>
                      {stateName}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <span className="error-message">{errors.state}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="district" className="form-label">
                  <MapPin size={16} className="input-icon" />
                  District
                </label>
                <select
                  id="district"
                  name="district"
                  className={`form-input form-select ${
                    errors.district ? "error" : ""
                  }`}
                  value={formData.district}
                  onChange={handleChange}
                  disabled={!formData.state}
                >
                  <option value="">Select District</option>
                  {formData.state ? (
                    getDistrictsForState(formData.state).map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      First select state
                    </option>
                  )}
                </select>
                {errors.district && (
                  <span className="error-message">{errors.district}</span>
                )}
              </div>
            </div>

            <button type="submit" className="auth-btn">
              Create Account <ArrowRight className="btn-icon" size={16} />
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Login
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-image">
          <div className="auth-overlay">
            <div className="auth-overlay-content">
              <h2>Smart Farming for a Better Tomorrow</h2>
              <p>
                Join FarmConnect and start making data-driven decisions for
                sustainable agriculture.
              </p>
              <div className="auth-features">
                <div className="auth-feature">
                  <Sprout className="auth-feature-icon" />
                  <span>Real-time crop monitoring</span>
                </div>
                <div className="auth-feature">
                  <MapPin className="auth-feature-icon" />
                  <span>Hyperlocal weather forecasts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;