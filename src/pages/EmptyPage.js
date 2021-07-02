import React from "react";
import { Link } from "react-router-dom";

function EmptyPage() {
    return (
        <div>
            <h4>잘못된 접근입니다.</h4>
            <Link to="/">돌아가기</Link>
        </div>
    );
}

export default EmptyPage;