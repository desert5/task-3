# task-3

## Task:
    The task is to build a JSON over HTTP API endpoint that takes as input two IATA/ICAO airport codes and provides as output a route between these two airports so that:
    The route consists of at most 4 legs/flights (that is, 3 stops/layovers, if going from A->B, a valid route could be A->1->2->3->B, or for example A->1->B etc.) and;
    The route is the shortest such route as measured in kilometers of geographical distance.
    For the bonus part, extend your service so that it also allows changing airports during stops that are within 100km of each other. For example, if going from A->B, a valid route could be A->1->2=>3->4->B, where “2=>3” is a change of airports done via ground. These switches are not considered as part of the legs/layover/hop count, but their distance should be reflected in the final distance calculated for the route.

Sample data provided by https://openflights.org/data.html

Too many legs (5): http://localhost:3000/path/KZN/YOW  
4 legs: http://localhost:3000/path/SVO/YOW  
With ground connection: http://localhost:3000/path/SYD/AMI  