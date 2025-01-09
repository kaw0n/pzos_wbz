const EventIdPage = ({
    params
}:{
    params: {
        eventId: string
    }
}) => {
    return ( 
        <div>
            Id wydarzenia: {params.eventId}
        </div>
     );
}
 
export default EventIdPage;