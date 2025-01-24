import React, { useState, useEffect } from 'react';

const FlashMessage = ({ flash }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            console.log('Flash data:', flash); // Log ข้อมูล Flash ครั้งเดียวต่อการเปลี่ยนแปลง
            setVisible(true); // แสดงข้อความ

            const timer = setTimeout(() => {
                setVisible(false); // ซ่อนข้อความหลังจาก 3 วินาที
            }, 3000);

            return () => clearTimeout(timer); // ลบ Timer ก่อนสร้างใหม่
        }
    }, [flash]); // ทำงานเมื่อ `flash` เปลี่ยน

    // ซ่อน Component หากไม่มีข้อความ
    if (!visible || (!flash?.success && !flash?.error)) return null;

    return (
        <div
            className={`${
                flash.success
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
            } mb-4 rounded border p-4`}
        >
            <p>{flash.success || flash.error}</p>
        </div>
    );
};

export default FlashMessage;
