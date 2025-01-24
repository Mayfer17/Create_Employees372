import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FlashMessage from '@/Components/FlashMessage';

//query คือ ค่าของการค้นหาที่ส่งมาจาก controller โดยจะเก็บไว้ในตัวแปร query
//employees คือ ข้อมูลของพนักงานทั้งหมดที่ส่งมาจาก controller โดยจะเก็บไว้ในตัวแปร employees

//สร้าง function เพื่อส่งการค้นหากลับไปให้ Controller ทํางาน
export default function Index({ employees, query }) {

    const { flash } = usePage().props;

    //search คือ ตัวแปรที่ใช้เก็บค่าของการค้นหา, setSearch คือ ฟังก์ชันเพื่ออัปเดตค่าค้นหา
    const [search, setSearch] = useState(query || '');//กำหนดค่าเริ่มต้นของ search 1)ถ้ามีค่า query ก็จะใช้ค่านั้นเป็นค่าเริ่มต้น  หรือ 2)ถ้าไม่มีให้ก็เป็นค่าว่าง

    //sortconfig ใช้เพื่อเก็บข้อมูลการเรียงลำดับ ส่วนฟังก์ชันsetSortConfig ใช้เพื่ออัปเดตค่าการเรียงลำดับ
    const [sortConfig, setSortConfig] = useState({ key: 'emp_no', direction: 'ascending' });

    const [showPhotoPreview, setShowPhotoPreview] = useState(false);
    const [photoURL, setPhotoURL] = useState('');

    const handleSearch = (e) => {  //เป็นฟังก์ชันที่ทำงานเมื่อผู้ใช้กดปุ่มค้นหา
        e.preventDefault(); //หยุดไม่ให้โหลดหน้าเว็บใหม่เมื่อกดปุ่ม submit
        router.get('/employee', { search }); //ส่งค่าที่ค้นหา(search) ไปที่เส้นทาง /employee
    };

    //เป็นฟังก์ชันที่ถูกเรียกเมื่อผู้ใช้คลิกที่หัวคอลัมน์เพื่อกำหนดค่าเรียงลำดับ (อัปเดต sortConfig)
    const requestSort = (key) => {  //โดยรับค่า key ที่เป็นชื่อคอลัมน์
        let direction = 'ascending'; //กำหนดค่าเริ่มต้นของทิศทางการเรียงจากน้อยไปมากอยู่เสมอ
        // เงื่อนไขคือถ้าชื่อคอลัมน์ยังเป็นอันเดิมอยู่ และ ทิศทางการเรียงเป็นแบบน้อยไปมากอยู่
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending'; //ให้เปลี่ยนเป็นมากไปน้อย
        }
        setSortConfig({ key, direction }); //อัปเดตค่าแล้วแสดงผลตามที่ผู้ใช้เลือก
    };

    //เรียงลำดับข้อมูลพนักงานจากค่าของ sortConfig ตามที่เลือกในฟังก์ชัน requestsort
    const sortedEmployees = [...employees.data].sort((a, b) => {   //สร้างตัวแปร sortedEmployees เพื่อเก็บข้อมูลพนักงานทั้งหมดที่เรียงลำดับ
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0; //แต่ถ้าค่ามันเท่ากันก็ไม่มีการเรียงเกิดขึ้น
    });

    //ฟังก์ชันgetArrowมีหน้าที่แสดงทิศทางลูกศร จะทำงานเมื่อมีการคลิกที่หัวคอลัมน์เพื่อเรียงลำดับ
    const getArrow = (key) => { //โดยรับค่า key ที่เป็นชื่อคอลัมน์
        if (sortConfig.key === key) { //ค่า sortConfig.key ตรงกับ key ที่ส่งมาไหม
            return sortConfig.direction === 'ascending' ? '↑' : '↓';
        }
        return '';
    };

    const handlePhotoPreview = (photo) => {
        setPhotoURL(`/storage/${photo}`);
        setShowPhotoPreview(true);
    };

    const handleClosePreview = () => {
        setShowPhotoPreview(false);
        setPhotoURL('');
    };

    return (
        <AuthenticatedLayout>
        <div>
        <FlashMessage flash={flash} />
            {showPhotoPreview && (
                <div
                style={{
                    position: 'fixed',top: '50%',left: '50%',transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(85, 82, 82, 0.37)',padding: '20px',borderRadius: '10px',
                    textAlign: 'center',zIndex: 1000,
                }}
            >
                <img
                    src={photoURL}
                    alt="Employee"
                    style={{maxWidth: '300px',maxHeight: '300px',objectFit: 'cover',borderRadius: '10px',marginBottom: '20px',
                    }}
                />
                <button
                    onClick={handleClosePreview}
                    style={{
                        backgroundColor: 'transparent',color: 'white',border: 'none',padding: '10px',right: '10px',
                        borderRadius: '5px',cursor: 'pointer',fontSize: '24px',position: 'absolute',top: '10px',
                    }}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
            )}
            {!showPhotoPreview && (
                <>
                    {employees.data.length > 0 && ( //เช็คว่ามีข้อมูลพนักงานหรือไม่ ถ้ามีให้แสดงหัวข้อและฟอร์มค้นหา
                        <>
                            <h1 style={{ fontSize: '2.3em', fontWeight: 'bold', textAlign: 'center', margin: '40px 50px', color: '#007bff' }}>Employees List</h1>
                            {/*ฟอร์มค้นหาพนักงาน*/}
                            <form onSubmit={handleSearch} style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '50px' }}>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)} //เมื่อมีการเปลี่ยนค่าในช่องค้นหาให้เรียกใช้ฟังก์ชัน setSearch เพื่ออัปเดตค่าค้นหา
                                    placeholder="Search employees..."
                                    style={{ marginRight: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', width: '250px' }}
                                />
                                <button type="submit" style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer' }}>
                                    Search
                                </button>
                            </form>
                        </>
                    )}
                    {employees.data.length === 0 ? ( //แต่ถ้าไม่มีข้อมูลพนักงานให้แสดงข้อความว่า Employee Not Found
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '85vh', position: 'relative' }}>
                            <p style={{ fontSize: '2.6em', fontWeight: 'bold', textAlign: 'center', color: 'gray' }}>Employee Not Found</p>
                            <button style={{ textDecoration: 'underline' }}
                                onMouseOver={(e) => { e.target.style.color = '#007bff'; }}
                                onMouseOut={(e) => { e.target.style.color = 'initial'; }}
                                onClick={() => window.location.href = '/employee'}>
                                Back To Home Page
                            </button>
                        </div>
                    ) : ( //แต่ถ้ามีข้อมูลพนักงานให้แสดงตารางข้อมูลพนักงาน
                        <div style={{ width: '100%', overflowX: 'auto' }}>
                            <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th onClick={() => requestSort('emp_no')} style={{ borderBottom: '1px solid #ddd', padding: '10px 20px', cursor: 'pointer', textAlign: 'center' }}>Employee ID {getArrow('emp_no')}</th>
                                            <th onClick={() => requestSort('first_name')} style={{ borderBottom: '1px solid #ddd', padding: '10px 20px', cursor: 'pointer', textAlign: 'center' }}>Firstname {getArrow('first_name')}</th>
                                            <th onClick={() => requestSort('last_name')} style={{ borderBottom: '1px solid #ddd', padding: '10px 20px', cursor: 'pointer', textAlign: 'center' }}>Lastname {getArrow('last_name')}</th>
                                            <th onClick={() => requestSort('birth_date')} style={{ borderBottom: '1px solid #ddd', padding: '10px 20px', cursor: 'pointer', textAlign: 'center' }}>Birthdate{getArrow('birth_date')}</th>
                                            <th onClick={() => requestSort('gender')} style={{ borderBottom: '1px solid #ddd', padding: '10px 20px', cursor: 'pointer', textAlign: 'center' }}>Gender {getArrow('gender')}</th>
                                            <th>Photo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedEmployees.map((employee, index) => ( //แสดงข้อมูลพนักงานทั้งหมด
                                            <tr key={employee.emp_no} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                                                <td style={{ borderBottom: '1px solid #ddd', padding: '10px 20px', textAlign: 'center' }}>{employee.emp_no}</td>
                                                <td style={{ borderBottom: '1px solid #ddd', padding: '10px 20px', textAlign: 'center' }}>{employee.first_name}</td>
                                                <td style={{ borderBottom: '1px solid #ddd', padding: '10px 20px', textAlign: 'center' }}>{employee.last_name}</td>
                                                <td style={{ borderBottom: '1px solid #ddd', padding: '10px 20px', textAlign: 'center' }}>{employee.birth_date}</td>
                                                <td style={{ borderBottom: '1px solid #ddd', padding: '10px 20px', textAlign: 'center' }}>{employee.gender}</td>
                                                <td style={{ borderBottom: '1px solid #ddd', padding: '10px 20px', textAlign: 'center', verticalAlign: 'middle'  }}>
                                                    {employee.photo && (
                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                                        <img
                                                            src={`/storage/${employee.photo}`}
                                                            alt="Employee Photo"
                                                            style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '50%' }}
                                                            className="cursor-pointer"
                                                            onClick={() => handlePhotoPreview(employee.photo)}
                                                        />
                                                    </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/*ปุ่ม Previous สำหรับเลื่อนไปหน้าก่อนหน้า*/}
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', alignItems: 'center' }}>
                                    <button
                                        onClick={() => router.get(employees.prev_page_url, { search })}
                                        disabled={!employees.prev_page_url}
                                        style={{
                                            margin: '0 5px',
                                            padding: '10px 15px',
                                            backgroundColor: '#fff',
                                            color: '#007bff',
                                            border: '1px solid #ddd',
                                            borderRadius: '5px',
                                            cursor: employees.prev_page_url ? 'pointer' : 'not-allowed',
                                            opacity: employees.prev_page_url ? 1 : 0.5,
                                        }}
                                    >
                                        &laquo; Previous
                                    </button>

                                    {/*แสดงหมายเลขหน้า*/}
                                    {(() => {
                                        const currentPage = employees.current_page;
                                        const lastPage = employees.last_page;
                                        const pageNumbers = [];

                                        for (let i = 1; i <= 3; i++) {
                                            if (i > lastPage) break;
                                            pageNumbers.push(i);
                                        }

                                        if (currentPage > 4) {
                                            pageNumbers.push('...');
                                        }

                                        for (let i = Math.max(1, currentPage - 1); i <= Math.min(lastPage, currentPage + 1); i++) {
                                            if (i > 3 && i < lastPage - 2) {
                                                pageNumbers.push(i);
                                            }
                                        }

                                        if (currentPage < lastPage - 3) {
                                            pageNumbers.push('...');
                                        }

                                        for (let i = lastPage - 2; i <= lastPage; i++) {
                                            if (i > 3 && i <= lastPage) {
                                                pageNumbers.push(i);
                                            }
                                        }
                                        {/*แสดงปุ่มหน้า*/}
                                        return pageNumbers.map((page, index) => (
                                            <button
                                                key={index}
                                                onClick={() => typeof page === 'number' && router.get(`${employees.path}?page=${page}`, { search })}
                                                style={{
                                                    margin: '0 5px',
                                                    padding: '10px 15px',
                                                    backgroundColor: page === currentPage ? '#007bff' : '#fff',
                                                    color: page === currentPage ? '#fff' : '#007bff',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '5px',
                                                    cursor: page === '...' ? 'not-allowed' : 'pointer',
                                                }}
                                            >
                                                {page}
                                            </button>
                                        ));
                                    })()}

                                    {/*ปุ่ม Next สำหรับเลื่อนไปหน้าถัดไป*/}
                                    <button
                                        onClick={() => router.get(employees.next_page_url, { search })}
                                        disabled={!employees.next_page_url}
                                        style={{
                                            margin: '0 5px',
                                            padding: '10px 15px',
                                            backgroundColor: '#fff',
                                            color: '#007bff',
                                            border: '1px solid #ddd',
                                            borderRadius: '5px',
                                            cursor: employees.next_page_url ? 'pointer' : 'not-allowed',
                                            opacity: employees.next_page_url ? 1 : 0.5,
                                        }}
                                    >
                                        Next &raquo;
                                    </button>
                                </div>

                                {/*เมื่อมีการค้นหาแล้วให้แสดงปุ่ม Back To Home Page เพื่อกลับไปหน้าหลัก*/}
                                {search.length > 0 && (
                                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                        <button
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                            onMouseOver={(e) => { e.target.style.color = '#007bff'; }}
                                            onMouseOut={(e) => { e.target.style.color = 'initial'; }}
                                            onClick={() => window.location.href = '/employee'}>
                                            Back To Home Page
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
        </AuthenticatedLayout>
    );
}
