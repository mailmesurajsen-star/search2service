"""
India Master Locations Dataset for Search2Service Backend
Complete dataset of all 28 States + 8 Union Territories and their major cities, districts, and localities.
"""

INDIA_STATES = [
    # 28 States
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    # 8 Union Territories
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh',
    'Lakshadweep',
    'Puducherry'
]

INDIA_LOCATIONS = [
    # ==========================================
    # BIHAR
    # ==========================================
    {'state': 'Bihar', 'district': 'Patna', 'city': 'Patna', 'areas': ['Boring Road', 'Kankarbagh', 'Bailey Road', 'Patliputra Colony', 'Frazer Road', 'Rajendra Nagar', 'Danapur', 'Anisabad', 'Ashok Rajpath', 'Saguna More', 'Digha', 'Gola Road']},
    {'state': 'Bihar', 'district': 'Gaya', 'city': 'Gaya', 'areas': ['Bodh Gaya', 'Civil Lines', 'AP Colony', 'Chandchaura', 'Manpur', 'Delha', 'Rampur', 'GB Road']},
    {'state': 'Bihar', 'district': 'Bhagalpur', 'city': 'Bhagalpur', 'areas': ['Tilkamani', 'Adampur', 'Zero Mile', 'Khanjarpur', 'Mirjanhat', 'Sabour', 'Naya Bazar', 'Tilkamanjhi']},
    {'state': 'Bihar', 'district': 'Muzaffarpur', 'city': 'Muzaffarpur', 'areas': ['Mithanpura', 'Aghoria Bazar', 'Brahmpura', 'Kalambagh Road', 'Gobarsahi', 'Kalyani', 'Juran Chapra', 'Bhagwanpur']},
    {'state': 'Bihar', 'district': 'Purnia', 'city': 'Purnia', 'areas': ['Line Bazar', 'Bhatta Bazar', 'Gulabbagh', 'Madhubani', 'Navratan Hatta', 'Khushkibagh']},
    {'state': 'Bihar', 'district': 'Darbhanga', 'city': 'Darbhanga', 'areas': ['Laheriasarai', 'Lalbagh', 'Tower Chowk', 'Donar', 'Benta', 'Allalpatti', 'Kadambag']},
    {'state': 'Bihar', 'district': 'Nalanda', 'city': 'Bihar Sharif', 'areas': ['Ranchi Road', 'Hospital Mor', 'Ramchandrapur', 'Kargil Chowk', 'Amber', 'Khandak Par']},
    {'state': 'Bihar', 'district': 'Bhojpur', 'city': 'Arrah', 'areas': ['Gopali Chowk', 'Nawada', 'Katira', 'Anaith', 'Sheoganj', 'Judge Bazar']},
    {'state': 'Bihar', 'district': 'Begusarai', 'city': 'Begusarai', 'areas': ['Har-Har Mahadev Chowk', 'Traffic Chowk', 'Vishnupur', 'Power House Road', 'Barauni', 'Refinery Township']},
    {'state': 'Bihar', 'district': 'Katihar', 'city': 'Katihar', 'areas': ['Mirchaibari', 'Bara Bazar', 'Ambedkar Chowk', 'Durgapur', 'Railway Colony']},
    {'state': 'Bihar', 'district': 'Munger', 'city': 'Munger', 'areas': ['Kashim Bazar', 'Bara Bazar', 'Fort Area', 'Shastri Nagar', 'Jamalpur']},
    {'state': 'Bihar', 'district': 'Saran', 'city': 'Chhapra', 'areas': ['Dahiyawan', 'Garkha', 'Prabhunath Nagar', 'Salempur', 'Municipal Chowk']},
    {'state': 'Bihar', 'district': 'Vaishali', 'city': 'Hajipur', 'areas': ['Cinema Road', 'Anwarpur', 'Bagmali', 'Rajendra Chowk', 'Adalpur', 'Industrial Area']},
    {'state': 'Bihar', 'district': 'West Champaran', 'city': 'Bettiah', 'areas': ['Station Road', 'Lal Bazar', 'Supriya Road', 'Ujjain Tola', 'Naya Tola']},
    {'state': 'Bihar', 'district': 'East Champaran', 'city': 'Motihari', 'areas': ['Main Market', 'Chatauni', 'Balua', 'Raja Bazar', 'Gandhi Chowk']},
    {'state': 'Bihar', 'district': 'Saharsa', 'city': 'Saharsa', 'areas': ['D.B. Road', 'Hatia Gachhi', 'Tiwari Tola', 'Bangaon Road', 'Purab Bazar']},
    {'state': 'Bihar', 'district': 'Rohtas', 'city': 'Sasaram', 'areas': ['Tomb Area', 'G.T. Road', 'Dharmshala', 'Fazalganj', 'Kudra Road']},
    {'state': 'Bihar', 'district': 'Rohtas', 'city': 'Dehri', 'areas': ['Station Road', 'Dalmiyanagar', 'Thana Chowk', 'Bypass Road']},
    {'state': 'Bihar', 'district': 'Siwan', 'city': 'Siwan', 'areas': ['Hospital Road', 'Babunia Road', 'Durbar Cinema Road', 'Mairwa Road', 'Tarawara Road']},
    {'state': 'Bihar', 'district': 'Samastipur', 'city': 'Samastipur', 'areas': ['Station Road', 'Mohanpur', 'Tajpur Road', 'Kashipur', 'Magardahi']},
    {'state': 'Bihar', 'district': 'Sitamarhi', 'city': 'Sitamarhi', 'areas': ['Mehsaul Chowk', 'Dumra Road', 'Janaki Sthan', 'Bhavdepur', 'Court Bazar']},
    {'state': 'Bihar', 'district': 'Madhubani', 'city': 'Madhubani', 'areas': ['Bata Chowk', 'Ganga Sagar', 'Hospital Road', 'Suratganj', 'Station Road']},
    {'state': 'Bihar', 'district': 'Nawada', 'city': 'Nawada', 'areas': ['Main Road', 'Sadbhawna Chowk', 'Station Road', 'Prasad Bigha', 'Gondi Road']},
    {'state': 'Bihar', 'district': 'Buxar', 'city': 'Buxar', 'areas': ['Station Road', 'Charitravan', 'Golambar', 'Piparapanti Road', 'Main Market']},
    {'state': 'Bihar', 'district': 'Kishanganj', 'city': 'Kishanganj', 'areas': ['Caltex Chowk', 'Dharamganj', 'Paschim Palli', 'Line Mohalla', 'Station Road']},
    {'state': 'Bihar', 'district': 'Gopalganj', 'city': 'Gopalganj', 'areas': ['Main Market', 'Banjari Road', 'Thana Chowk', 'Post Office Chowk', 'Yadopur Road']},
    {'state': 'Bihar', 'district': 'Aurangabad', 'city': 'Aurangabad', 'areas': ['Ramesh Chowk', 'GT Road', 'Dharmshala Road', 'Karma Road', 'Maharajganj']},
    {'state': 'Bihar', 'district': 'Jehanabad', 'city': 'Jehanabad', 'areas': ['Court Area', 'Main Road', 'Station Road', 'Unta', 'Mallickana']},
    {'state': 'Bihar', 'district': 'Supaul', 'city': 'Supaul', 'areas': ['Gandhi Chowk', 'Station Road', 'Bazar Samiti', 'Veer Kunwar Singh Chowk']},
    {'state': 'Bihar', 'district': 'Jamui', 'city': 'Jamui', 'areas': ['Kutchery Road', 'Station Road', 'Maharajganj', 'Bodhban']},

    # ==========================================
    # MAHARASHTRA
    # ==========================================
    {'state': 'Maharashtra', 'district': 'Mumbai', 'city': 'Mumbai', 'areas': ['Andheri West', 'Andheri East', 'Bandra West', 'Bandra East', 'Powai', 'Dadar', 'Borivali', 'Juhu', 'Goregaon', 'Malad', 'Kandivali', 'Colaba', 'Lower Parel', 'Kurla', 'Chembur', 'Ghatkopar', 'Mulund', 'Santacruz']},
    {'state': 'Maharashtra', 'district': 'Pune', 'city': 'Pune', 'areas': ['Kothrud', 'Hinjewadi', 'Kharadi', 'Baner', 'Viman Nagar', 'Wakad', 'Hadapsar', 'Aundh', 'Shivaji Nagar', 'Kalyani Nagar', 'Magarpatta', 'Pimpri-Chinchwad', 'Bavdhan', 'FC Road']},
    {'state': 'Maharashtra', 'district': 'Nagpur', 'city': 'Nagpur', 'areas': ['Dharampeth', 'Sitabuldi', 'Wardha Road', 'Manish Nagar', 'Pratap Nagar', 'Sadar', 'Ramdaspeth', 'Civil Lines', 'Nandanvan']},
    {'state': 'Maharashtra', 'district': 'Thane', 'city': 'Thane', 'areas': ['Ghodbunder Road', 'Majiwada', 'Vasant Vihar', 'Naupada', 'Kopri', 'Hiranandani Estate', 'Manpada', 'Wagle Estate']},
    {'state': 'Maharashtra', 'district': 'Thane', 'city': 'Navi Mumbai', 'areas': ['Vashi', 'Nerul', 'Kharghar', 'Belapur', 'Seawoods', 'Panvel', 'Airoli', 'Kopar Khairane', 'Ghansoli']},
    {'state': 'Maharashtra', 'district': 'Thane', 'city': 'Kalyan', 'areas': ['Kalyan West', 'Kalyan East', 'Dombivli East', 'Dombivli West', 'Khadakpada']},
    {'state': 'Maharashtra', 'district': 'Nashik', 'city': 'Nashik', 'areas': ['College Road', 'Gangapur Road', 'Indira Nagar', 'Panchavati', 'Cidco', 'Satpur', 'Ambad', 'Dwarka']},
    {'state': 'Maharashtra', 'district': 'Chhatrapati Sambhajinagar', 'city': 'Chhatrapati Sambhajinagar', 'areas': ['CIDCO', 'Cannaught Place', 'Samarth Nagar', 'Garkheda', 'Seven Hills', 'Waluj', 'Shendra', 'Railway Station Road']},
    {'state': 'Maharashtra', 'district': 'Solapur', 'city': 'Solapur', 'areas': ['Hotgi Road', 'Jule Solapur', 'Saat Rasta', 'Old Pune Naka', 'Budhwar Peth', 'Ashok Chowk']},
    {'state': 'Maharashtra', 'district': 'Kolhapur', 'city': 'Kolhapur', 'areas': ['Rajarampuri', 'Tarabai Park', 'Shahupuri', 'Laxmipuri', 'Nagala Park', 'Gandhinagar']},
    {'state': 'Maharashtra', 'district': 'Amravati', 'city': 'Amravati', 'areas': ['Rajapeth', 'Gadge Nagar', 'Badnera Road', 'Camp Area', 'Rathi Nagar']},
    {'state': 'Maharashtra', 'district': 'Nanded', 'city': 'Nanded', 'areas': ['VIP Road', 'Shivaji Nagar', 'Taroda Naka', 'Workshop Road', 'Khadkpura']},
    {'state': 'Maharashtra', 'district': 'Sangli', 'city': 'Sangli', 'areas': ['Vishrambag', 'Miraj Road', 'Gaon Bhag', 'Kupwad', 'Khanbhag']},
    {'state': 'Maharashtra', 'district': 'Jalgaon', 'city': 'Jalgaon', 'areas': ['Navi Peth', 'Ring Road', 'MIDC', 'Jilha Peth', 'Mahabal']},
    {'state': 'Maharashtra', 'district': 'Akola', 'city': 'Akola', 'areas': ['Civil Lines', 'Gorakshan Road', 'Toshniwal Layout', 'Jatharpeth', 'Kaulkhed']},
    {'state': 'Maharashtra', 'district': 'Latur', 'city': 'Latur', 'areas': ['MIDC Road', 'Ausa Road', 'Ambajogai Road', 'Khadgaon Road', 'Nandi Stop']},
    {'state': 'Maharashtra', 'district': 'Ahmednagar', 'city': 'Ahmednagar', 'areas': ['Savedi', 'Pipeline Road', 'Station Road', 'Bhingar', 'Market Yard']},

    # ==========================================
    # DELHI (NCT)
    # ==========================================
    {'state': 'Delhi', 'district': 'New Delhi', 'city': 'Delhi', 'areas': ['Connaught Place', 'Karol Bagh', 'Saket', 'Dwarka', 'Rohini', 'Lajpat Nagar', 'Janakpuri', 'Pitampura', 'Vasant Kunj', 'Hauz Khas', 'Mayur Vihar', 'Laxmi Nagar', 'Chandni Chowk', 'Paschim Vihar', 'Greater Kailash', 'South Extension', 'Nehru Place', 'Uttam Nagar', 'Model Town', 'Patel Nagar']},

    # ==========================================
    # KARNATAKA
    # ==========================================
    {'state': 'Karnataka', 'district': 'Bengaluru Urban', 'city': 'Bengaluru', 'areas': ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout', 'Jayanagar', 'JP Nagar', 'Electronic City', 'BTM Layout', 'Hebbal', 'Marathahalli', 'Yelahanka', 'Malleshwaram', 'Rajajinagar', 'Bannerghatta Road', 'Bellandur', 'Sarjapur Road', 'Kalyan Nagar']},
    {'state': 'Karnataka', 'district': 'Mysuru', 'city': 'Mysuru', 'areas': ['Gokulam', 'Jayalakshmipuram', 'Kuvempunagar', 'Vijayanagar', 'Saraswathipuram', 'Hebbal', 'Siddhartha Layout', 'Vontikoppal']},
    {'state': 'Karnataka', 'district': 'Dharwad', 'city': 'Hubballi', 'areas': ['Vidyanagar', 'Gokul Road', 'Keshwapur', 'Shirur Park', 'Deshpande Nagar', 'Unkal']},
    {'state': 'Karnataka', 'district': 'Dakshina Kannada', 'city': 'Mangaluru', 'areas': ['Kadri', 'Bejai', 'Lalbagh', 'Kankanady', 'Hampankatta', 'Urwa', 'Valencia', 'Kottara']},
    {'state': 'Karnataka', 'district': 'Belagavi', 'city': 'Belagavi', 'areas': ['Tilakwadi', 'Camp', 'Hindwadi', 'Udyambag', 'Khanapur Road', 'Rani Chennamma Nagar']},
    {'state': 'Karnataka', 'district': 'Kalaburagi', 'city': 'Kalaburagi', 'areas': ['Sedam Road', 'Super Market', 'MSK Mill Area', 'Brahmpur', 'Aiwan-E-Shahi']},
    {'state': 'Karnataka', 'district': 'Davanagere', 'city': 'Davanagere', 'areas': ['MCC B Block', 'Vidyanagar', 'Hadadi Road', 'KB Extension', 'Jayadevanagar']},
    {'state': 'Karnataka', 'district': 'Ballari', 'city': 'Ballari', 'areas': ['Cantonment', 'Gandhi Nagar', 'Brucepet', 'Infantry Road', 'Parvathi Nagar']},
    {'state': 'Karnataka', 'district': 'Shivamogga', 'city': 'Shivamogga', 'areas': ['Vinoba Nagara', 'Gopala Gowda Extension', 'Kuvempu Road', 'Jayanagar', 'Tilak Nagar']},
    {'state': 'Karnataka', 'district': 'Tumakuru', 'city': 'Tumakuru', 'areas': ['Siddaganga Ext', 'Batawadi', 'SS Puram', 'Ashok Nagar', 'Kyathsandra']},
    {'state': 'Karnataka', 'district': 'Udupi', 'city': 'Udupi', 'areas': ['Manipal', 'Car Street', 'Kalsanka', 'Ambagilu', 'Santhekatte', 'Malpe']},

    # ==========================================
    # TAMIL NADU
    # ==========================================
    {'state': 'Tamil Nadu', 'district': 'Chennai', 'city': 'Chennai', 'areas': ['T. Nagar', 'Adyar', 'Velachery', 'Anna Nagar', 'Mylapore', 'OMR (Old Mahabalipuram Rd)', 'Nungambakkam', 'Guindy', 'Tambaram', 'Chromepet', 'Porur', 'Alwarpet', 'Besant Nagar', 'Kilpauk', 'Perambur', 'Sholinganallur']},
    {'state': 'Tamil Nadu', 'district': 'Coimbatore', 'city': 'Coimbatore', 'areas': ['RS Puram', 'Gandhipuram', 'Peelamedu', 'Saibaba Colony', 'Saravanampatti', 'Ramanathapuram', 'Singanallur', 'Vadavalli', 'Ukkadam']},
    {'state': 'Tamil Nadu', 'district': 'Madurai', 'city': 'Madurai', 'areas': ['KK Nagar', 'Anna Nagar', 'SS Colony', 'Tallakulam', 'Simmakkal', 'Mattuthavani', 'Villapuram', 'Tirunagar']},
    {'state': 'Tamil Nadu', 'district': 'Tiruchirappalli', 'city': 'Tiruchirappalli', 'areas': ['Thillai Nagar', 'Cantonment', 'KK Nagar', 'Srirangam', 'Central Bus Stand', 'Woraiyur', 'Ponmalai']},
    {'state': 'Tamil Nadu', 'district': 'Salem', 'city': 'Salem', 'areas': ['Fairlands', 'Alagapuram', 'Hasthampatti', 'Suramangalam', 'Shevapet', 'Ammapet', 'Meyyanur']},
    {'state': 'Tamil Nadu', 'district': 'Tiruppur', 'city': 'Tiruppur', 'areas': ['Avinashi Road', 'Kangeyam Road', 'Palladam Road', 'Dharapuram Road', 'Kumar Nagar']},
    {'state': 'Tamil Nadu', 'district': 'Erode', 'city': 'Erode', 'areas': ['Perundurai Road', 'Brough Road', 'Sathy Road', 'Gandhiji Road', 'Surampatti']},
    {'state': 'Tamil Nadu', 'district': 'Tirunelveli', 'city': 'Tirunelveli', 'areas': ['Palayamkottai', 'Vannarpettai', 'Town', 'Perumalpuram', 'Melapalayam']},
    {'state': 'Tamil Nadu', 'district': 'Vellore', 'city': 'Vellore', 'areas': ['Katpadi', 'Gandhi Nagar', 'Sathuvachari', 'Bagayam', 'Thorapadi']},
    {'state': 'Tamil Nadu', 'district': 'Krishnagiri', 'city': 'Hosur', 'areas': ['Bagalur Road', 'Sipcot Phase 1', 'Mookandapalli', 'Avalapalli', 'Denkanikottai Road']},

    # ==========================================
    # TELANGANA
    # ==========================================
    {'state': 'Telangana', 'district': 'Hyderabad', 'city': 'Hyderabad', 'areas': ['Gachibowli', 'Hitec City', 'Banjara Hills', 'Jubilee Hills', 'Kukatpally', 'Madhapur', 'Kondapur', 'Secunderabad', 'Ameerpet', 'Begumpet', 'Dilsukhnagar', 'Miyapur', 'Manikonda', 'Kompally', 'Uppal', 'LB Nagar', 'Charminar']},
    {'state': 'Telangana', 'district': 'Warangal', 'city': 'Warangal', 'areas': ['Hanamkonda', 'Kazipet', 'Subedari', 'Nayeem Nagar', 'Hunter Road', 'Waddepally', 'Pochamma Maidan']},
    {'state': 'Telangana', 'district': 'Nizamabad', 'city': 'Nizamabad', 'areas': ['Khaleelwadi', 'Bodhan Road', 'Armoor Road', 'Subhash Nagar', 'Vinayak Nagar']},
    {'state': 'Telangana', 'district': 'Karimnagar', 'city': 'Karimnagar', 'areas': ['Mukarampura', 'Kashmirgadda', 'Collectorate Area', 'Vidyanagar', 'Mankammathota']},
    {'state': 'Telangana', 'district': 'Khammam', 'city': 'Khammam', 'areas': ['Wyra Road', 'Rotary Nagar', 'Mayuri Centre', 'Ghandhi Chowk', 'Mamatha Hospital Road']},

    # ==========================================
    # WEST BENGAL
    # ==========================================
    {'state': 'West Bengal', 'district': 'Kolkata', 'city': 'Kolkata', 'areas': ['Salt Lake (Bidhannagar)', 'Park Street', 'New Town', 'Ballygunge', 'Gariahat', 'Dum Dum', 'Behala', 'Alipore', 'Shyambazar', 'Garia', 'Jadavpur', 'Tollygunge', 'Barasat', 'Rajarhat', 'Lake Town', 'Kankurgachi']},
    {'state': 'West Bengal', 'district': 'Howrah', 'city': 'Howrah', 'areas': ['Shibpur', 'Salkia', 'Bally', 'Liluah', 'Kadamtala', 'Santragachi', 'Mandirtala']},
    {'state': 'West Bengal', 'district': 'Darjeeling', 'city': 'Siliguri', 'areas': ['Sevoke Road', 'Pradhan Nagar', 'Hakim Para', 'Matigara', 'Subhas Pally', 'Salugara', 'Bagdogra']},
    {'state': 'West Bengal', 'district': 'Paschim Bardhaman', 'city': 'Durgapur', 'areas': ['City Centre', 'Benachity', 'Bidhannagar', 'A-Zone', 'B-Zone', 'Muchipara']},
    {'state': 'West Bengal', 'district': 'Paschim Bardhaman', 'city': 'Asansol', 'areas': ['Ushagram', 'Burnpur', 'Court Area', 'Kalyanpur', 'Sen Raleigh Road', 'Hutton Road']},
    {'state': 'West Bengal', 'district': 'Purba Bardhaman', 'city': 'Bardhaman', 'areas': ['Curzon Gate', 'Golapbag', 'Birhata', 'Khagragarh', 'Badamtala']},
    {'state': 'West Bengal', 'district': 'Malda', 'city': 'Malda (English Bazar)', 'areas': ['Mahanandapara', 'Kothabari', 'Rathbari', 'Mokdumpur', 'Jhaljhalia']},
    {'state': 'West Bengal', 'district': 'Murshidabad', 'city': 'Baharampur', 'areas': ['Gorabazar', 'Panchanantala', 'Cantonment', 'Mohona', 'Ranibagan']},
    {'state': 'West Bengal', 'district': 'Paschim Medinipur', 'city': 'Kharagpur', 'areas': ['IIT Campus', 'Golbazar', 'Malancha', 'Inda', 'Nimpura', 'Chhototengra']},

    # ==========================================
    # GUJARAT
    # ==========================================
    {'state': 'Gujarat', 'district': 'Ahmedabad', 'city': 'Ahmedabad', 'areas': ['Bodakdev', 'Satellite', 'Vastrapur', 'Navrangpura', 'Maninagar', 'SG Highway', 'Prahlad Nagar', 'Bopal', 'Ghatlodiya', 'Chandkheda', 'Naranpura', 'Paldi', 'Thaltej', 'Science City']},
    {'state': 'Gujarat', 'district': 'Surat', 'city': 'Surat', 'areas': ['Adajan', 'Vesu', 'Varachha', 'Piplod', 'Athwa Lines', 'Katargam', 'Rander', 'Pal', 'Ghod Dod Road', 'Citylight', 'Udhna']},
    {'state': 'Gujarat', 'district': 'Vadodara', 'city': 'Vadodara', 'areas': ['Alkapuri', 'Gotri', 'Manjalpur', 'Akota', 'Fatehgunj', 'Vasna Road', 'Karelibaug', 'Sayajigunj', 'Waghodia Road', 'Sama']},
    {'state': 'Gujarat', 'district': 'Rajkot', 'city': 'Rajkot', 'areas': ['Kalawad Road', '150 Feet Ring Road', 'Yagnik Road', 'University Road', 'Madhapar', 'Nana Mava', 'Mavdi', 'Bhakti Nagar']},
    {'state': 'Gujarat', 'district': 'Bhavnagar', 'city': 'Bhavnagar', 'areas': ['Waghawadi Road', 'Kalanala', 'Ghogha Circle', 'Subhashnagar', 'Sardarnagar', 'Chitra']},
    {'state': 'Gujarat', 'district': 'Jamnagar', 'city': 'Jamnagar', 'areas': ['Patel Colony', 'Digjam Plot', 'Khodiyar Colony', 'Sumair Club Road', 'Gokul Nagar']},
    {'state': 'Gujarat', 'district': 'Junagadh', 'city': 'Junagadh', 'areas': ['Zanzarda Road', 'Moti Baug', 'Talav Gate', 'Joshipura', 'Kalwa Chowk']},
    {'state': 'Gujarat', 'district': 'Gandhinagar', 'city': 'Gandhinagar', 'areas': ['Sector 11', 'Sector 21', 'Kudasan', 'Raysan', 'Infocity', 'Sargasan', 'Vavol', 'GIFT City']},
    {'state': 'Gujarat', 'district': 'Anand', 'city': 'Anand', 'areas': ['Vallabh Vidyanagar', 'Amul Dairy Road', 'Ganesh Chokdi', 'Nana Bazar', 'Mota Bazar']},
    {'state': 'Gujarat', 'district': 'Navsari', 'city': 'Navsari', 'areas': ['Lunsikui', 'Jalalpor Road', 'Station Road', 'Vijalpor', 'Sandhkuva']},
    {'state': 'Gujarat', 'district': 'Morbi', 'city': 'Morbi', 'areas': ['Sanala Road', 'Kandla Highway', 'Ravapar Road', 'Lati Plot', 'Trajpar']},
    {'state': 'Gujarat', 'district': 'Valsad', 'city': 'Vapi', 'areas': ['GIDC', 'Chala', 'Gunjan', 'Koparli Road', 'Daman Road', 'Chanod Colony']},

    # ==========================================
    # RAJASTHAN
    # ==========================================
    {'state': 'Rajasthan', 'district': 'Jaipur', 'city': 'Jaipur', 'areas': ['C-Scheme', 'Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'Raja Park', 'Tonk Road', 'Jagatpura', 'Bani Park', 'Ajmer Road', 'Sodala', 'Vidhyadhar Nagar', 'Gopalpura', 'Jhotwara', 'Pink City / MI Road']},
    {'state': 'Rajasthan', 'district': 'Jodhpur', 'city': 'Jodhpur', 'areas': ['Shastri Nagar', 'Ratanada', 'Sardarpura', 'Paota', 'Pal Road', 'Chopasni Housing Board', 'Air Force Area', 'Basni']},
    {'state': 'Rajasthan', 'district': 'Kota', 'city': 'Kota', 'areas': ['Vigyan Nagar', 'Talwandi', 'Mahaveer Nagar', 'Indra Vihar', 'Rajeev Gandhi Nagar', 'Dadabari', 'Gumanpura', 'Kunhari']},
    {'state': 'Rajasthan', 'district': 'Bikaner', 'city': 'Bikaner', 'areas': ['Jayanarayan Vyas Colony', 'Sadul Ganj', 'Kanta Khaturia Colony', 'Rani Bazar', 'Pawan Puri', 'Ganga Shahar']},
    {'state': 'Rajasthan', 'district': 'Ajmer', 'city': 'Ajmer', 'areas': ['Vaishali Nagar', 'Civil Lines', 'Panchsheel Nagar', 'Adarsh Nagar', 'Kaiser Ganj', 'Ana Sagar Circular Road']},
    {'state': 'Rajasthan', 'district': 'Udaipur', 'city': 'Udaipur', 'areas': ['Fatehpura', 'Hiran Magri', 'Madhuban', 'Saheli Nagar', 'Shobhagpura', 'Bhuwana', 'Sukhadia Circle', 'Panchwati']},
    {'state': 'Rajasthan', 'district': 'Bhilwara', 'city': 'Bhilwara', 'areas': ['Subhash Nagar', 'Bhopal Ganj', 'Shastri Nagar', 'Azad Nagar', 'Pur Road']},
    {'state': 'Rajasthan', 'district': 'Alwar', 'city': 'Alwar', 'areas': ['Moti Doongri', 'Scheme No. 2', 'Manu Marg', 'Malviya Nagar', 'NEB Housing Board']},
    {'state': 'Rajasthan', 'district': 'Sikar', 'city': 'Sikar', 'areas': ['Piprali Road', 'Bajaj Road', 'Station Road', 'Radhakishan Pura', 'Fatehpur Road']},
    {'state': 'Rajasthan', 'district': 'Sri Ganganagar', 'city': 'Sri Ganganagar', 'areas': ['Model Town', 'Jawahar Nagar', 'Purani Abadi', 'Setia Colony', 'Sukhadia Circle']},

    # ==========================================
    # UTTAR PRADESH
    # ==========================================
    {'state': 'Uttar Pradesh', 'district': 'Lucknow', 'city': 'Lucknow', 'areas': ['Hazratganj', 'Gomti Nagar', 'Aliganj', 'Indira Nagar', 'Alambagh', 'Mahanagar', 'Jankipuram', 'Ashiyana', 'Vikas Nagar', 'Chowk', 'Aminabad', 'Charbagh', 'Sushant Golf City', 'Rajajipuram', 'Telibagh']},
    {'state': 'Uttar Pradesh', 'district': 'Kanpur Nagar', 'city': 'Kanpur', 'areas': ['Civil Lines', 'Swaroop Nagar', 'Kakadeo', 'Govind Nagar', 'Kidwai Nagar', 'Kalyanpur', 'Lajpat Nagar', 'Mall Road', 'Sharda Nagar', 'Barra']},
    {'state': 'Uttar Pradesh', 'district': 'Varanasi', 'city': 'Varanasi', 'areas': ['Sigra', 'Lanka', 'Bhelupur', 'Mahmoorganj', 'Cantonment', 'Assi Ghat', 'Godowlia', 'Orderly Bazar', 'Shivpur', 'Pandeypur']},
    {'state': 'Uttar Pradesh', 'district': 'Agra', 'city': 'Agra', 'areas': ['Sanjay Place', 'Kamla Nagar', 'Fatehabad Road', 'Dayal Bagh', 'Tajganj', 'Shahganj', 'Sikandra', 'Khandari', 'Civil Lines']},
    {'state': 'Uttar Pradesh', 'district': 'Prayagraj', 'city': 'Prayagraj (Allahabad)', 'areas': ['Civil Lines', 'George Town', 'Katra', 'Tagore Town', 'Allahpur', 'Mumfordganj', 'Naini', 'Teliyarganj', 'Dhoomanganj']},
    {'state': 'Uttar Pradesh', 'district': 'Gautam Buddha Nagar', 'city': 'Noida', 'areas': ['Sector 18', 'Sector 62', 'Sector 137', 'Sector 50', 'Sector 76', 'Sector 15', 'Sector 128', 'Sector 12', 'Sector 34', 'Sector 104']},
    {'state': 'Uttar Pradesh', 'district': 'Gautam Buddha Nagar', 'city': 'Greater Noida', 'areas': ['Alpha 1', 'Beta 1', 'Gamma 2', 'Delta 1', 'Pari Chowk', 'Knowledge Park 3', 'Gaur City', 'Techzone 4', 'Surajpur']},
    {'state': 'Uttar Pradesh', 'district': 'Ghaziabad', 'city': 'Ghaziabad', 'areas': ['Indirapuram', 'Vaishali', 'Vasundhara', 'Raj Nagar Extension', 'Crossings Republik', 'Kaushambi', 'Kavi Nagar', 'Govindpuram']},
    {'state': 'Uttar Pradesh', 'district': 'Meerut', 'city': 'Meerut', 'areas': ['Shastri Nagar', 'Civil Lines', 'Ganga Nagar', 'Sadar Bazar', 'Pallavpuram', 'Kanker Khera', 'Delhi Road']},
    {'state': 'Uttar Pradesh', 'district': 'Bareilly', 'city': 'Bareilly', 'areas': ['Civil Lines', 'Rajendra Nagar', 'DD Puram', 'Subhash Nagar', 'Prem Nagar', 'Model Town', 'Pilibhit Bypass']},
    {'state': 'Uttar Pradesh', 'district': 'Aligarh', 'city': 'Aligarh', 'areas': ['Marris Road', 'Civil Lines', 'Center Point', 'Ramghat Road', 'Samad Road', 'Medical Road']},
    {'state': 'Uttar Pradesh', 'district': 'Moradabad', 'city': 'Moradabad', 'areas': ['Civil Lines', 'Ram Ganga Vihar', 'Mansi Vihar', 'Budh Bazar', 'Kanth Road']},
    {'state': 'Uttar Pradesh', 'district': 'Gorakhpur', 'city': 'Gorakhpur', 'areas': ['Golghar', 'Civil Lines', 'Mohaddipur', 'Medical College Road', 'Taramandal', 'Shahpur', 'Betiahata']},
    {'state': 'Uttar Pradesh', 'district': 'Jhansi', 'city': 'Jhansi', 'areas': ['Civil Lines', 'Sadhan Nagar', 'Elite Crossing', 'Sadar Bazar', 'Sipri Bazar', 'Nandanpura']},
    {'state': 'Uttar Pradesh', 'district': 'Ayodhya', 'city': 'Ayodhya', 'areas': ['Ram Janmabhoomi Area', 'Civil Lines (Faizabad)', 'Naya Ghat', 'Rekabganj', 'Devkali', 'Rambabu Chowk']},
    {'state': 'Uttar Pradesh', 'district': 'Mathura', 'city': 'Mathura', 'areas': ['Krishna Nagar', 'Dampier Nagar', 'Highway City', 'Govardhan Road', 'Vrindavan', 'Janam Bhumi Area']},
    {'state': 'Uttar Pradesh', 'district': 'Saharanpur', 'city': 'Saharanpur', 'areas': ['Court Road', 'Mission Compound', 'Delhi Road', 'Hakikat Nagar', 'Bajoria Road']},

    # ==========================================
    # MADHYA PRADESH
    # ==========================================
    {'state': 'Madhya Pradesh', 'district': 'Indore', 'city': 'Indore', 'areas': ['Vijay Nagar', 'Palasia', 'AB Road', 'MG Road', 'Bhawarkua', 'Sapna Sangeeta', 'Annapurna', 'Rau', 'By-pass Road', 'Geeta Bhawan', 'Super Corridor']},
    {'state': 'Madhya Pradesh', 'district': 'Bhopal', 'city': 'Bhopal', 'areas': ['MP Nagar', 'Arera Colony', 'Gulmohar', 'Kolar Road', 'Hoshangabad Road', 'TT Nagar', 'Indrapuri', 'Bairagarh', 'Shyamla Hills', 'Ayodhya Bypass']},
    {'state': 'Madhya Pradesh', 'district': 'Jabalpur', 'city': 'Jabalpur', 'areas': ['Civil Lines', 'Wright Town', 'Napier Town', 'Gorakhpur', 'Vijay Nagar', 'Madan Mahal', 'Ganjipura']},
    {'state': 'Madhya Pradesh', 'district': 'Gwalior', 'city': 'Gwalior', 'areas': ['City Centre', 'Lashkar', 'Morar', 'Thatipur', 'Govindpuri', 'Phoolbagh', 'Deen Dayal Nagar']},
    {'state': 'Madhya Pradesh', 'district': 'Ujjain', 'city': 'Ujjain', 'areas': ['Freeganj', 'Mahakal Road', 'Nanakheda', 'Sethi Nagar', 'Rishi Nagar', 'Dewas Road']},
    {'state': 'Madhya Pradesh', 'district': 'Sagar', 'city': 'Sagar', 'areas': ['Civil Lines', 'Makroniya', 'Gopalganj', 'Tilli Road', 'Katra Bazar']},
    {'state': 'Madhya Pradesh', 'district': 'Dewas', 'city': 'Dewas', 'areas': ['AB Road', 'Civil Lines', 'Bhopal Road', 'Ganga Nagar', 'Ujjain Road']},
    {'state': 'Madhya Pradesh', 'district': 'Satna', 'city': 'Satna', 'areas': ['Civil Lines', 'Rewa Road', 'Panna Naka', 'Prem Nagar', 'Bharhut Nagar']},
    {'state': 'Madhya Pradesh', 'district': 'Ratlam', 'city': 'Ratlam', 'areas': ['Do Batti', 'Kothari Nagar', 'Station Road', 'Alkapuri', 'Kasturba Nagar']},
    {'state': 'Madhya Pradesh', 'district': 'Rewa', 'city': 'Rewa', 'areas': ['Civil Lines', 'College Road', 'Nehru Nagar', 'Bodabag', 'Samariya Chowk']},

    # ==========================================
    # ANDHRA PRADESH
    # ==========================================
    {'state': 'Andhra Pradesh', 'district': 'Visakhapatnam', 'city': 'Visakhapatnam', 'areas': ['MVP Colony', 'Siripuram', 'Gajuwaka', 'Madhurawada', 'Dwaraka Nagar', 'Rushikonda', 'Jagadamba Centre', 'Seethammadhara', 'Pendurthi']},
    {'state': 'Andhra Pradesh', 'district': 'NTR', 'city': 'Vijayawada', 'areas': ['Benz Circle', 'MG Road', 'Labbipet', 'Patamata', 'Governorpet', 'Satyanarayanapuram', 'Gollapudi', 'Auto Nagar']},
    {'state': 'Andhra Pradesh', 'district': 'Guntur', 'city': 'Guntur', 'areas': ['Lakshmipuram', 'Brodipet', 'Arundelpet', 'Vidya Nagar', 'Pattabhipuram', 'Kothapet', 'Amaravati Road']},
    {'state': 'Andhra Pradesh', 'district': 'Tirupati', 'city': 'Tirupati', 'areas': ['Alipiri', 'Korlagunta', 'Bhavani Nagar', 'KT Road', 'Air Bypass Road', 'Chandragiri', 'MR Palle']},
    {'state': 'Andhra Pradesh', 'district': 'Nellore', 'city': 'Nellore', 'areas': ['Magunta Layout', 'Pogathota', 'Vedayapalem', 'Dargamitta', 'Balaji Nagar']},
    {'state': 'Andhra Pradesh', 'district': 'Kurnool', 'city': 'Kurnool', 'areas': ['Santosh Nagar', 'Mourya Inn Area', 'Nandyal Checkpost', 'Birla Gate', 'C-Camp']},
    {'state': 'Andhra Pradesh', 'district': 'Kakinada', 'city': 'Kakinada', 'areas': ['Bhanugudi Junction', 'Suryaraopeta', 'Ramanayyapeta', 'Main Road', 'Cinema Road']},
    {'state': 'Andhra Pradesh', 'district': 'East Godavari', 'city': 'Rajahmundry', 'areas': ['Danavaipeta', 'Kotipalli Bus Stand', 'Morampudi', 'Aryapuram', 'Kambal Cheruvu']},
    {'state': 'Andhra Pradesh', 'district': 'Anantapur', 'city': 'Anantapur', 'areas': ['Subash Nagar', 'RTC Bus Stand Area', 'Clock Tower', 'Court Road', 'Housing Board']},
    {'state': 'Andhra Pradesh', 'district': 'YSR Kadapa', 'city': 'Kadapa', 'areas': ['Nagarajupalle', 'Seven Roads Circle', 'Co-operative Colony', 'Yerramukkapalli']},

    # ==========================================
    # PUNJAB
    # ==========================================
    {'state': 'Punjab', 'district': 'Ludhiana', 'city': 'Ludhiana', 'areas': ['Model Town', 'Sarabha Nagar', 'BRS Nagar', 'Civil Lines', 'Ferozepur Road', 'Pakhowal Road', 'Dugri', 'Ghumar Mandi']},
    {'state': 'Punjab', 'district': 'Amritsar', 'city': 'Amritsar', 'areas': ['Ranjit Avenue', 'Mall Road', 'Lawrence Road', 'Green Avenue', 'Majitha Road', 'Circular Road', 'Golden Temple Area']},
    {'state': 'Punjab', 'district': 'Jalandhar', 'city': 'Jalandhar', 'areas': ['Model Town', 'Civil Lines', 'Urban Estate Phase 2', 'Cantt Road', 'BMC Chowk', 'Rama Mandi']},
    {'state': 'Punjab', 'district': 'Patiala', 'city': 'Patiala', 'areas': ['Model Town', 'Leela Bhawan', 'Urban Estate Phase 1', 'Baradari', 'Chhoti Baradari']},
    {'state': 'Punjab', 'district': 'SAS Nagar', 'city': 'Mohali', 'areas': ['Phase 7', 'Phase 3B2', 'Sector 70', 'Sector 82 (Aerocity)', 'Phase 5', 'Sector 68', 'Kharar']},
    {'state': 'Punjab', 'district': 'Bathinda', 'city': 'Bathinda', 'areas': ['Civil Lines', 'Model Town', 'Mall Road', 'Goniana Road', 'Kamla Nehru Colony']},
    {'state': 'Punjab', 'district': 'Hoshiarpur', 'city': 'Hoshiarpur', 'areas': ['Model Town', 'Mall Road', 'Civil Lines', 'Prabhat Chowk', 'Sutheri Road']},
    {'state': 'Punjab', 'district': 'Pathankot', 'city': 'Pathankot', 'areas': ['Mission Road', 'Dhangu Road', 'Model Town', 'Patel Chowk', 'Saili Road']},

    # ==========================================
    # HARYANA
    # ==========================================
    {'state': 'Haryana', 'district': 'Gurugram', 'city': 'Gurugram', 'areas': ['DLF Phase 1-5', 'Cyber City', 'Golf Course Road', 'Sohna Road', 'Sector 56', 'Sector 14', 'Sector 29', 'Sector 45', 'New Gurgaon (Sector 82-95)', 'MG Road']},
    {'state': 'Haryana', 'district': 'Faridabad', 'city': 'Faridabad', 'areas': ['Sector 15', 'Sector 16', 'NIT 1-5', 'Greater Faridabad (Neharpar)', 'Greenfield Colony', 'Sector 21C', 'Surajkund Road']},
    {'state': 'Haryana', 'district': 'Panipat', 'city': 'Panipat', 'areas': ['Model Town', 'GT Road', 'Sector 11-12', 'Assandh Road', 'Sukhdev Nagar', 'Ansals Sushant City']},
    {'state': 'Haryana', 'district': 'Ambala', 'city': 'Ambala', 'areas': ['Ambala Cantt', 'Ambala City', 'Model Town', 'Cloth Market', 'Sector 7', 'Prem Nagar']},
    {'state': 'Haryana', 'district': 'Karnal', 'city': 'Karnal', 'areas': ['Model Town', 'Sector 13', 'Sector 14', 'Kunjpura Road', 'Mughal Canal', 'NDRI Area']},
    {'state': 'Haryana', 'district': 'Hisar', 'city': 'Hisar', 'areas': ['Model Town', 'Urban Estate II', 'Sector 14', 'Delhi Road', 'Red Square Market']},
    {'state': 'Haryana', 'district': 'Rohtak', 'city': 'Rohtak', 'areas': ['Model Town', 'Civil Lines', 'Sector 1-4', 'Delhi Road', 'Medical Mor', 'Mansarovar Colony']},
    {'state': 'Haryana', 'district': 'Panchkula', 'city': 'Panchkula', 'areas': ['Sector 7', 'Sector 8', 'Sector 20', 'Sector 12', 'Mansa Devi Complex', 'Industrial Area']},
    {'state': 'Haryana', 'district': 'Sonipat', 'city': 'Sonipat', 'areas': ['Model Town', 'Sector 14-15', 'Murthal Road', 'Kundli (TDI City)', 'Atlas Road']},

    # ==========================================
    # ODISHA
    # ==========================================
    {'state': 'Odisha', 'district': 'Khordha', 'city': 'Bhubaneswar', 'areas': ['Saheed Nagar', 'Jayadev Vihar', 'Nayapalli', 'Patia', 'Chandrasekharpur', 'Khandagiri', 'Old Town', 'Unit 1-9', 'KIIT Road', 'Infocity', 'Rasulgarh']},
    {'state': 'Odisha', 'district': 'Cuttack', 'city': 'Cuttack', 'areas': ['Badambadi', 'College Square', 'Link Road', 'CDA Sector 6-10', 'Bidanasi', 'Choudhury Bazar', 'Madhupatna']},
    {'state': 'Odisha', 'district': 'Sundargarh', 'city': 'Rourkela', 'areas': ['Civil Township', 'Panposh', 'Udit Nagar', 'Sector 1-20', 'Chhend Colony', 'Koel Nagar']},
    {'state': 'Odisha', 'district': 'Ganjam', 'city': 'Berhampur', 'areas': ['Gandhi Nagar', 'Giri Road', 'Engineering School Road', 'Bhavani Nagar', 'Gosani Nuagaon']},
    {'state': 'Odisha', 'district': 'Sambalpur', 'city': 'Sambalpur', 'areas': ['Dhanupali', 'Budharaja', 'Ainthapali', 'Fatak', 'Khetrajpur', 'Bareipali']},
    {'state': 'Odisha', 'district': 'Puri', 'city': 'Puri', 'areas': ['Grand Road (Bada Danda)', 'VIP Road', 'Marine Drive', 'Chakratirtha Road', 'Baliapanda']},
    {'state': 'Odisha', 'district': 'Balasore', 'city': 'Balasore', 'areas': ['Fakir Mohan Nagar', 'Station Road', 'Sahadevkhunta', 'Cinema Bazar', 'O.T. Road']},

    # ==========================================
    # KERALA
    # ==========================================
    {'state': 'Kerala', 'district': 'Thiruvananthapuram', 'city': 'Thiruvananthapuram', 'areas': ['Kowdiar', 'Vellayambalam', 'Pattom', 'Kazhakoottam (Technopark)', 'Sasthamangalam', 'Palayam', 'Statue', 'Vazhuthacaud', 'Medical College', 'Thampanoor']},
    {'state': 'Kerala', 'district': 'Ernakulam', 'city': 'Kochi', 'areas': ['Kakkanad (Infopark)', 'Marine Drive', 'Panampilly Nagar', 'MG Road', 'Edappally', 'Palarivattom', 'Kaloor', 'Fort Kochi', 'Aluva', 'Vyttila', 'Thripunithura']},
    {'state': 'Kerala', 'district': 'Kozhikode', 'city': 'Kozhikode', 'areas': ['Mavoor Road', 'SM Street', 'Beach Road', 'Nadakkavu', 'Palayam', 'Kallai', 'Chevayur', 'Thondayad']},
    {'state': 'Kerala', 'district': 'Thrissur', 'city': 'Thrissur', 'areas': ['Swaraj Round', 'Ayyanthole', 'East Fort', 'Punkunnam', 'Koorkenchery', 'Ollur', 'Chembukkavu']},
    {'state': 'Kerala', 'district': 'Kollam', 'city': 'Kollam', 'areas': ['Chinnakada', 'Asramam', 'Kadavoor', 'Tangasseri', 'Polayathode', 'Kavanad']},
    {'state': 'Kerala', 'district': 'Kannur', 'city': 'Kannur', 'areas': ['Thana', 'South Bazar', 'Payyambalam', 'Talap', 'Burnassery', 'Mele Chovva']},
    {'state': 'Kerala', 'district': 'Kottayam', 'city': 'Kottayam', 'areas': ['Collectorate Area', 'Nagampadam', 'Kanjikuzhy', 'Baker Junction', 'Ettumanoor']},
    {'state': 'Kerala', 'district': 'Palakkad', 'city': 'Palakkad', 'areas': ['Fort Maidan', 'Stadium Bypass Road', 'Chandranagar', 'Olavakkode', 'Civil Station']},

    # ==========================================
    # ASSAM
    # ==========================================
    {'state': 'Assam', 'district': 'Kamrup Metropolitan', 'city': 'Guwahati', 'areas': ['GS Road', 'Zoo Road (RG Baruah Rd)', 'Ganeshguri', 'Panbazar', 'Paltan Bazaar', 'Beltola', 'Six Mile', 'Ulubari', 'Chandmari', 'Jalukbari', 'Hatigaon', 'Khanapara']},
    {'state': 'Assam', 'district': 'Cachar', 'city': 'Silchar', 'areas': ['Tarapur', 'Rangirkhari', 'Janiganj', 'Meherpur', 'Ambicapatty', 'Sillchar Medical College Area']},
    {'state': 'Assam', 'district': 'Dibrugarh', 'city': 'Dibrugarh', 'areas': ['Thana Chariali', 'Graham Bazar', 'Amolapatty', 'Chowkidinghee', 'Mancotta Road']},
    {'state': 'Assam', 'district': 'Jorhat', 'city': 'Jorhat', 'areas': ['Gar-Ali', 'Barbheta', 'Tarajan', 'AT Road', 'Na-Ali', 'Jail Road']},
    {'state': 'Assam', 'district': 'Nagaon', 'city': 'Nagaon', 'areas': ['Haibargaon', 'Christianpatty', 'Fauzdaripatty', 'Dimaruguri', 'Khatowal']},
    {'state': 'Assam', 'district': 'Sonitpur', 'city': 'Tezpur', 'areas': ['Mission Chariali', 'Tribeni', 'Chanmari', 'Mahabhairab', 'Mazgaon']},
    {'state': 'Assam', 'district': 'Tinsukia', 'city': 'Tinsukia', 'areas': ['Rangagora Road', 'GNB Road', 'Parbatia', 'Borguri', 'Chirwapatty']},

    # ==========================================
    # JHARKHAND
    # ==========================================
    {'state': 'Jharkhand', 'district': 'Ranchi', 'city': 'Ranchi', 'areas': ['Main Road', 'Lalpur', 'Harmu Housing Colony', 'Ashok Nagar', 'Doranda', 'Kanke Road', 'Hinoo', 'Morabadi', 'Bariatu', 'Ratu Road', 'Namkum']},
    {'state': 'Jharkhand', 'district': 'East Singhbhum', 'city': 'Jamshedpur', 'areas': ['Bistupur', 'Sakchi', 'Kadma', 'Sonari', 'Telco Colony', 'Golmuri', 'Baridih', 'Mango', 'Adityapur']},
    {'state': 'Jharkhand', 'district': 'Dhanbad', 'city': 'Dhanbad', 'areas': ['Bank More', 'Saraidhela', 'Hirapur', 'Steel Gate', 'Bartand', 'Dhaiya', 'Park Market']},
    {'state': 'Jharkhand', 'district': 'Bokaro', 'city': 'Bokaro Steel City', 'areas': ['City Centre (Sector 4)', 'Sector 1-12', 'Chas', 'Co-operative Colony', 'Camp 2']},
    {'state': 'Jharkhand', 'district': 'Deoghar', 'city': 'Deoghar', 'areas': ['Tower Chowk', 'Castairs Town', 'Baidyanath Dham Area', 'Jasidih Road', 'Williams Town', 'Kunda']},
    {'state': 'Jharkhand', 'district': 'Hazaribagh', 'city': 'Hazaribagh', 'areas': ['Matwari', 'Nawabganj', 'Dipugarha', 'Kallu Chowk', 'Canary Hill Road']},
    {'state': 'Jharkhand', 'district': 'Giridih', 'city': 'Giridih', 'areas': ['Bara Chowk', 'Makatpur', 'Pachamba', 'Station Road', 'Bhandaridih']},

    # ==========================================
    # CHHATTISGARH
    # ==========================================
    {'state': 'Chhattisgarh', 'district': 'Raipur', 'city': 'Raipur', 'areas': ['Shankar Nagar', 'Pandri', 'Devendra Nagar', 'Samta Colony', 'Tatibandh', 'Civil Lines', 'Telibandha', 'VIP Road', 'Nava Raipur (Atal Nagar)', 'Pachpedi Naka']},
    {'state': 'Chhattisgarh', 'district': 'Durg', 'city': 'Bhilai', 'areas': ['Civic Centre', 'Sector 1-10', 'Nehru Nagar', 'Supela', 'Smriti Nagar', 'Power House', 'Junwani']},
    {'state': 'Chhattisgarh', 'district': 'Bilaspur', 'city': 'Bilaspur', 'areas': ['Vyapar Vihar', 'Link Road', 'Civil Lines', 'Rajkishore Nagar', 'Rama Magneto Mall Area', 'Mangla', 'Sarkanda']},
    {'state': 'Chhattisgarh', 'district': 'Korba', 'city': 'Korba', 'areas': ['Transport Nagar', 'TP Nagar', 'Niharika', 'Kosabadi', 'Balco Township', 'Darri']},
    {'state': 'Chhattisgarh', 'district': 'Rajnandgaon', 'city': 'Rajnandgaon', 'areas': ['Ganj Line', 'Kailash Nagar', 'Basantpur', 'Gaurav Path', 'Old High Court Road']},
    {'state': 'Chhattisgarh', 'district': 'Raigarh', 'city': 'Raigarh', 'areas': ['Chakradhar Nagar', 'Station Road', 'Kotwali Road', 'Boirdad', 'Dhimrapur']},

    # ==========================================
    # UTTARAKHAND
    # ==========================================
    {'state': 'Uttarakhand', 'district': 'Dehradun', 'city': 'Dehradun', 'areas': ['Rajpur Road', 'Jakhan', 'Ballupur', 'Dharampur', 'Clock Tower', 'Sahastradhara Road', 'Vasant Vihar', 'Clement Town', 'Prem Nagar', 'Race Course', 'Chakrata Road']},
    {'state': 'Uttarakhand', 'district': 'Haridwar', 'city': 'Haridwar', 'areas': ['Ranipur More', 'Jwalapur', 'Kankhal', 'Har Ki Pauri Area', 'BHEL Township', 'Shivalik Nagar']},
    {'state': 'Uttarakhand', 'district': 'Haridwar', 'city': 'Roorkee', 'areas': ['Civil Lines', 'IIT Roorkee Campus Area', 'Malviya Chowk', 'Delhi Road', 'Solanipuram']},
    {'state': 'Uttarakhand', 'district': 'Nainital', 'city': 'Haldwani', 'areas': ['Kaladhungi Road', 'Nainital Road', 'Tikonia', 'Kathgodam', 'Mukhani', 'Heera Nagar']},
    {'state': 'Uttarakhand', 'district': 'Udham Singh Nagar', 'city': 'Rudrapur', 'areas': ['Civil Lines', 'Awas Vikas', 'Kashipur Bypass', 'SIDCUL Area', 'Gaba Chowk']},
    {'state': 'Uttarakhand', 'district': 'Dehradun', 'city': 'Rishikesh', 'areas': ['Triveni Ghat', 'Tapovan', 'Laxman Jhula Area', 'Muni Ki Reti', 'AIIMS Road', 'Dehradun Road']},
    {'state': 'Uttarakhand', 'district': 'Nainital', 'city': 'Nainital', 'areas': ['Mall Road', 'Tallital', 'Mallital', 'Ayarpatta', 'Sukhatal']},

    # ==========================================
    # HIMACHAL PRADESH
    # ==========================================
    {'state': 'Himachal Pradesh', 'district': 'Shimla', 'city': 'Shimla', 'areas': ['The Mall Road', 'Sanjauli', 'Chotta Shimla', 'Kasumpti', 'New Shimla', 'Lakkar Bazar', 'Summer Hill', 'Boileauganj']},
    {'state': 'Himachal Pradesh', 'district': 'Kangra', 'city': 'Dharamshala', 'areas': ['McLeod Ganj', 'Kotwali Bazar', 'Civil Lines', 'Dari', 'Sidhpur', 'Bhagsunag', 'Yol Cantt']},
    {'state': 'Himachal Pradesh', 'district': 'Solan', 'city': 'Solan', 'areas': ['Mall Road', 'Chambaghat', 'Katha', 'Kotlanala', 'Deonghat', 'Kumarhatti']},
    {'state': 'Himachal Pradesh', 'district': 'Mandi', 'city': 'Mandi', 'areas': ['Seri Bazar', 'Sauli Khad', 'Bhiuli', 'Rani Ki Bain', 'Indira Market']},
    {'state': 'Himachal Pradesh', 'district': 'Kullu', 'city': 'Kullu', 'areas': ['Dhalpur', 'Sarvari', 'Gandhi Nagar', 'Akhara Bazar', 'Shastri Nagar']},
    {'state': 'Himachal Pradesh', 'district': 'Kullu', 'city': 'Manali', 'areas': ['Mall Road', 'Old Manali', 'Aleo', 'Vashisht', 'Rangri', 'Simsa']},
    {'state': 'Himachal Pradesh', 'district': 'Solan', 'city': 'Baddi', 'areas': ['Sai Road', 'Housing Board Phase 1-3', 'Bhud', 'Sandholi', 'Barotiwala']},

    # ==========================================
    # GOA
    # ==========================================
    {'state': 'Goa', 'district': 'North Goa', 'city': 'Panaji', 'areas': ['Miramar', 'Campal', 'Fontainhas (Latin Quarter)', 'Caranzalem', 'Altinho', 'Dona Paula', 'Patto Plaza', 'St Inez']},
    {'state': 'Goa', 'district': 'South Goa', 'city': 'Margao', 'areas': ['Fatorda', 'Gogol', 'Pajifond', 'Borda', 'Aquem', 'Comba', 'Vidyanagar']},
    {'state': 'Goa', 'district': 'South Goa', 'city': 'Vasco da Gama', 'areas': ['Baina', 'Chicalim', 'Mangor Hill', 'Vaddem', 'Mormugao', 'Airport Road']},
    {'state': 'Goa', 'district': 'North Goa', 'city': 'Mapusa', 'areas': ['Market Area', 'Khorlim', 'Ganeshpuri', 'Duler', 'Ansabhat', 'Karaswada']},
    {'state': 'Goa', 'district': 'North Goa', 'city': 'Calangute', 'areas': ['Tito\'s Lane', 'Baga Road', 'Candolim Road', 'Gauravaddo', 'Umtta Vaddo']},
    {'state': 'Goa', 'district': 'South Goa', 'city': 'Ponda', 'areas': ['Tisk', 'Upper Bazar', 'Curti', 'Khadpabandh', 'Dhavali']},
    {'state': 'Goa', 'district': 'North Goa', 'city': 'Porvorim', 'areas': ['NH66 Highway', 'Alto-Porvorim', 'Socorro', 'Salvador do Mundo', 'Co-op Society']},

    # ==========================================
    # JAMMU AND KASHMIR (UT)
    # ==========================================
    {'state': 'Jammu and Kashmir', 'district': 'Srinagar', 'city': 'Srinagar', 'areas': ['Lal Chowk', 'Rajbagh', 'Karan Nagar', 'Jawahar Nagar', 'Dalgate', 'Sanat Nagar', 'Hyderpora', 'Bemina', 'Batmaloo', 'Soura', 'Hazratbal']},
    {'state': 'Jammu and Kashmir', 'district': 'Jammu', 'city': 'Jammu', 'areas': ['Gandhi Nagar', 'Channi Himmat', 'Trikuta Nagar', 'Bahu Plaza', 'Talab Tillo', 'Janipur', 'Bakshi Nagar', 'Roop Nagar', 'Satwari']},
    {'state': 'Jammu and Kashmir', 'district': 'Anantnag', 'city': 'Anantnag', 'areas': ['KP Road', 'Nai Basti', 'Lal Chowk Anantnag', 'Khanabal', 'Ashajipora']},
    {'state': 'Jammu and Kashmir', 'district': 'Baramulla', 'city': 'Baramulla', 'areas': ['Main Town', 'Kantbagh', 'Noorbagh', 'Kanispora', 'Delina']},
    {'state': 'Jammu and Kashmir', 'district': 'Kathua', 'city': 'Kathua', 'areas': ['College Road', 'Govindsar', 'Hatli Morh', 'Mukherjee Chowk', 'Industrial Estate']},
    {'state': 'Jammu and Kashmir', 'district': 'Udhampur', 'city': 'Udhampur', 'areas': ['Dhar Road', 'Mukherjee Bazar', 'Gole Market', 'Subhash Nagar', 'Battal Ballian']},

    # ==========================================
    # CHANDIGARH (UT)
    # ==========================================
    {'state': 'Chandigarh', 'district': 'Chandigarh', 'city': 'Chandigarh', 'areas': ['Sector 17 (City Centre)', 'Sector 35', 'Sector 22', 'Sector 8-9', 'Sector 26', 'Sector 43', 'IT Park', 'Manimajra', 'Industrial Area Phase 1-2', 'Sector 34']},

    # ==========================================
    # TRIPURA
    # ==========================================
    {'state': 'Tripura', 'district': 'West Tripura', 'city': 'Agartala', 'areas': ['Banamalipur', 'Krishnanagar', 'Radhanagar', 'Kunjaban', 'Melarmath', 'Akhaura Road', 'Dhaleswar', 'Battala', 'GBP Hospital Area']},
    {'state': 'Tripura', 'district': 'North Tripura', 'city': 'Dharmanagar', 'areas': ['Barabari', 'Station Road', 'Office Tilla', 'Dewanpasa', 'Nayapara']},
    {'state': 'Tripura', 'district': 'Gomati', 'city': 'Udaipur', 'areas': ['Central Road', 'Matabari', 'Rajshri Hall Area', 'Gomati River Side', 'Rajarbag']},

    # ==========================================
    # MEGHALAYA
    # ==========================================
    {'state': 'Meghalaya', 'district': 'East Khasi Hills', 'city': 'Shillong', 'areas': ['Police Bazar', 'Laitumkhrah', 'Labal', 'Nongthymmai', 'Mawlai', 'Rilbong', 'Polo Grounds', 'Malki', 'Upper Shillong']},
    {'state': 'Meghalaya', 'district': 'West Garo Hills', 'city': 'Tura', 'areas': ['Chandmari', 'Dobasipara', 'Hawakhana', 'Araimile', 'Ringrey', 'Bazar Area']},
    {'state': 'Meghalaya', 'district': 'West Jaintia Hills', 'city': 'Jowai', 'areas': ['Iawmusiang', 'Chutwakhu', 'Ladthalaboh', 'Mynthong', 'Panaliar']},

    # ==========================================
    # MANIPUR
    # ==========================================
    {'state': 'Manipur', 'district': 'Imphal West', 'city': 'Imphal', 'areas': ['Thangal Bazar', 'Paona Bazar', 'Kwakeithel', 'Lamphelpat', 'Uripok', 'Singjamei', 'RIMS Road', 'Sagolband', 'Chingmeirong']},
    {'state': 'Manipur', 'district': 'Thoubal', 'city': 'Thoubal', 'areas': ['Thoubal Bazar', 'Athokpam', 'Wangjing', 'Haokha', 'Kakching Khunou']},
    {'state': 'Manipur', 'district': 'Churachandpur', 'city': 'Churachandpur', 'areas': ['IB Road', 'Tuibong', 'Tedim Road', 'Rengkai', 'New Lamka']},

    # ==========================================
    # NAGALAND
    # ==========================================
    {'state': 'Nagaland', 'district': 'Kohima', 'city': 'Kohima', 'areas': ['PR Hill', 'High School Colony', 'Razhu Point', 'Midland', 'Kezieke', 'Officers Hill', 'PWD Colony']},
    {'state': 'Nagaland', 'district': 'Dimapur', 'city': 'Dimapur', 'areas': ['Circular Road', 'Duncan Bosti', 'Notun Bosti', 'Nagarjan', 'Purana Bazar', 'Burma Camp', 'Chumoukedima']},
    {'state': 'Nagaland', 'district': 'Mokokchung', 'city': 'Mokokchung', 'areas': ['Arkong', 'Artisans Village', 'Mokokchung Village', 'Tongdentsuyong', 'Yimyu']},

    # ==========================================
    # ARUNACHAL PRADESH
    # ==========================================
    {'state': 'Arunachal Pradesh', 'district': 'Papum Pare', 'city': 'Itanagar', 'areas': ['Ganga Market', 'E-Sector', 'Bank Tinali', 'Zero Point', 'Secretariat Area', 'Niti Vihar', 'Chandranagar']},
    {'state': 'Arunachal Pradesh', 'district': 'Papum Pare', 'city': 'Naharlagun', 'areas': ['Barapani', 'Model Village', 'A-Sector', 'Helipad Area', 'Railway Station Area']},
    {'state': 'Arunachal Pradesh', 'district': 'East Siang', 'city': 'Pasighat', 'areas': ['Main Market', 'Baking', 'Mirbuk', 'Gumin Nagar', 'Medical Colony']},
    {'state': 'Arunachal Pradesh', 'district': 'Tawang', 'city': 'Tawang', 'areas': ['Old Market', 'New Market', 'Monastery Road', 'Nehru Market']},

    # ==========================================
    # MIZORAM
    # ==========================================
    {'state': 'Mizoram', 'district': 'Aizawl', 'city': 'Aizawl', 'areas': ['Zarkawt', 'Chanmari', 'Bawngkawn', 'Khatla', 'Mission Veng', 'Dawrpui', 'Kulwn', 'Ramhlun']},
    {'state': 'Mizoram', 'district': 'Lunglei', 'city': 'Lunglei', 'areas': ['Venglai', 'Bazar Veng', 'Rahsi Veng', 'Chanmari Lunglei', 'Serkawn']},

    # ==========================================
    # SIKKIM
    # ==========================================
    {'state': 'Sikkim', 'district': 'East Sikkim', 'city': 'Gangtok', 'areas': ['MG Marg', 'Tadong', 'Deorali', 'Development Area', 'Arithang', 'Sichey', 'Ranipool', 'Burtuk']},
    {'state': 'Sikkim', 'district': 'South Sikkim', 'city': 'Namchi', 'areas': ['Central Park', 'Char Dham Road', 'Samdruptse Road', 'Bhanjyang Road']},

    # ==========================================
    # PUDUCHERRY (UT)
    # ==========================================
    {'state': 'Puducherry', 'district': 'Puducherry', 'city': 'Puducherry', 'areas': ['White Town (French Quarter)', 'Heritage Town', 'MG Road', 'Mission Street', 'Lawspet', 'Muthialpet', 'Auroville Area', 'Reddiarpalayam', 'Ellaipillaichavady']},
    {'state': 'Puducherry', 'district': 'Karaikal', 'city': 'Karaikal', 'areas': ['Church Street', 'Bharathiar Street', 'Kamaraj Salai', 'Thirunallar Road', 'Beach Road']},

    # ==========================================
    # ANDAMAN AND NICOBAR ISLANDS (UT)
    # ==========================================
    {'state': 'Andaman and Nicobar Islands', 'district': 'South Andaman', 'city': 'Port Blair', 'areas': ['Aberdeen Bazar', 'Garacharma', 'Junglighat', 'Haddo', 'Dollygunj', 'Bambooflat', 'Bathubasti', 'Chatham', 'Shadipur']},
    {'state': 'Andaman and Nicobar Islands', 'district': 'South Andaman', 'city': 'Havelock (Swaraj Dweep)', 'areas': ['Govind Nagar', 'Vijay Nagar', 'Radhanagar', 'Kala Pathar']},

    # ==========================================
    # DADRA AND NAGAR HAVELI AND DAMAN AND DIU (UT)
    # ==========================================
    {'state': 'Dadra and Nagar Haveli and Daman and Diu', 'district': 'Daman', 'city': 'Daman', 'areas': ['Nani Daman', 'Moti Daman', 'Devka Beach Road', 'Dunetha', 'Kathiria', 'Vapi Road']},
    {'state': 'Dadra and Nagar Haveli and Daman and Diu', 'district': 'Dadra and Nagar Haveli', 'city': 'Silvassa', 'areas': ['Sayli Road', 'Naroli Road', 'Tokarkhada', 'Samarvarni', 'Piparia', 'Amli']},
    {'state': 'Dadra and Nagar Haveli and Daman and Diu', 'district': 'Diu', 'city': 'Diu', 'areas': ['Fort Road', 'Bunder Chowk', 'Nagoa Beach Area', 'Ghoghla', 'Main Bazar']},

    # ==========================================
    # LADAKH (UT)
    # ==========================================
    {'state': 'Ladakh', 'district': 'Leh', 'city': 'Leh', 'areas': ['Main Bazaar', 'Changspa', 'Fort Road', 'Skara', 'Choglamsar', 'Old Leh', 'Airport Road']},
    {'state': 'Ladakh', 'district': 'Kargil', 'city': 'Kargil', 'areas': ['Main Market', 'Baroo', 'Biamathang', 'Poyen', 'Hospital Road']},

    # ==========================================
    # LAKSHADWEEP (UT)
    # ==========================================
    {'state': 'Lakshadweep', 'district': 'Lakshadweep', 'city': 'Kavaratti', 'areas': ['Main Jetty Area', 'Secretariat Area', 'Hospital Road', 'Beach Road', 'South Beach']},
    {'state': 'Lakshadweep', 'district': 'Lakshadweep', 'city': 'Agatti', 'areas': ['Airport Road', 'Lagoon Beach', 'Eastern Jetty', 'Bazar Area']}
]

def get_all_states():
    """Return all 36 Indian states and union territories sorted alphabetically."""
    return sorted(list(INDIA_STATES))

def get_cities_by_state(state_name: str = None):
    """Return unique cities across India or filtered by state."""
    if not state_name or state_name.lower() == 'all':
        cities = {loc['city'] for loc in INDIA_LOCATIONS if loc.get('city')}
        return sorted(list(cities))
    
    cities = {loc['city'] for loc in INDIA_LOCATIONS if loc['state'].lower() == state_name.lower() and loc.get('city')}
    return sorted(list(cities))

def get_districts_by_state(state_name: str = None):
    """Return unique districts for a given state."""
    if not state_name or state_name.lower() == 'all':
        districts = {loc['district'] for loc in INDIA_LOCATIONS if loc.get('district')}
        return sorted(list(districts))
    
    districts = {loc['district'] for loc in INDIA_LOCATIONS if loc['state'].lower() == state_name.lower() and loc.get('district')}
    return sorted(list(districts))

def get_areas_by_city(state_name: str = None, city_name: str = None, district_name: str = None):
    """Return list of areas for a given city / state."""
    matched_areas = set()
    for loc in INDIA_LOCATIONS:
        if state_name and loc['state'].lower() != state_name.lower():
            continue
        if district_name and loc['district'].lower() != district_name.lower():
            continue
        if city_name and loc['city'].lower() != city_name.lower():
            continue
        for area in loc.get('areas', []):
            if area:
                matched_areas.add(area)
    return sorted(list(matched_areas))
