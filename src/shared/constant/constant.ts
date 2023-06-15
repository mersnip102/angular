export class TypeReportPAKN{
    public static DotXuat =0;
    public static Tuan=1;
    public static Thang=2;
    public static Quy=3;
    public static Nam=4;
}

export class Const{
    public static max_upload_image="5";
    public static max_upload_video="2";
    public static max_upload_file="2";
    public static type_video=2;
    public static type_image=1;
    public static type_other=0;
}

export class ENhomNguoiDung{
    public static BaoCao=20;
    public static DuyetBaoCao=24;
    public static XemBaoCao=42;
    public static QuanTri=28;
}

export const LoaiBaoCaoPAKN=[
    {
        id:0,
        name:"Đột xuất"
    },
    {
        id:1,
        name:"Định kỳ theo tuần"
    },
    {
        id:2,
        name:"Định kỳ theo tháng"
    },
    {
        id:3,
        name:"Định kỳ theo quý"
    },
    {
        id:4,
        name:"Định kỳ theo năm"
    },
]
export class RoleAdmin{
    public static admin="ADMIN";
}
