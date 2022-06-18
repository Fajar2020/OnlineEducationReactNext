import { Card, Badge } from "antd";
import Link from "next/link";

const {Meta} = Card;

const CourseCard = ({
    course
}) => {
    const { name, slug, instructor, price, image, paid, category} = course;

    return (
        <Link href={`/course/${slug}`}>
            <a>
                <Card className="mb-4" cover={
                    <img 
                        src={image} 
                        alt={name} 
                        style={{height: "200px", objectFit:"cover"}}
                        className="p-1"
                    />
                }>
                    <h3>{name}</h3>
                    <p>by : {instructor.name} <span className="ms-3"><b>{paid ? `Price : ${price}` : 'Free'}</b></span></p>
                    <Badge count={category} style={{backgroundColor: "#03a9f4"}} />
                </Card>
            </a>
        </Link>
    );
};

export default CourseCard;
