<?php
require_once "ConnectionFactory.php";

/**
 * Class ConnectionLink
 */
class ConnectionLink
{
    private $shelterpro, $vadim;

    /**
     * ConnectionLink constructor.
     */
    public function __construct()
    {
        $connection_factory = ConnectionFactory::get_factory();
        $this->shelterpro = $connection_factory->get_shelterpro_connection();
        $this->vadim = $connection_factory->get_vadim_connection();
    }

    /**
     * @return mixed
     */
    public function get_username()
    {
        return explode(":", base64_decode($_COOKIE['usersession']))[0];
    }

    public function query_incident_notes($incident_key)
    {
        $q = "SELECT p.name 'Author', n.notememo,  n.notedate
              FROM note n, person p
              WHERE p.personkey = n.addedbyuser
              AND n.eventtype = 10
              AND n.eventkey = ?";
        $execute_values = array($incident_key);
        return $this->shelterpro->run_query($q, $execute_values);
    }

    /**
     * @param $animal_key
     *
     * @return mixed
     */
    public function query_animal_details($animal_key)
    {
        $q = "SELECT a.furcolr1 'Main Color', 
                       a.furcolr2 'Second Color', 
                       a.coat, 
                       a.breed1   'Breed', 
                       a.crossbreed, 
                       a.fix, 
                       a.gender,
                       a.age, 
                       p.NAME     AS owner_name, 
                       a.persownr AS owner_key, 
                       dangerous = CASE a.beh_tag3 
                                     WHEN 'DANGEROUS' THEN 'YES' 
                                     ELSE 
                                       CASE r.registtype 
                                         WHEN 'DANGEROUS' THEN 'YES' 
                                         ELSE 'NO' 
                                       END 
                                   END, 
                       aggressive = CASE a.beh_tag1 
                                      WHEN 'AGGRESSIVE' THEN 'YES' 
                                      ELSE 
                                        CASE r.registtype 
                                          WHEN 'AGGRESSIVE' THEN 'YES' 
                                          ELSE 'NO' 
                                        END 
                                    END 
                FROM   animal a 
                       LEFT JOIN person p 
                              ON p.personkey = a.persownr 
                       LEFT JOIN regist r 
                              ON r.animalkey = a.animalkey 
                WHERE  a.animalkey = ?; ";
        $execute_values = array($animal_key);
        return $this->shelterpro->run_query($q, $execute_values);
    }

    /**
     * @param $animal_key
     *
     * @return mixed
     */
    public function query_animal_incidents($animal_key)
    {
        $q = "SELECT i.incidentkey, i.status, alink.animalkey, alink.eventkey, ( LTRIM(RTRIM(a.addressstreetname)) + ' ' + LTRIM(RTRIM(a.addressstreettype)) + ' ' + LTRIM(RTRIM(a.addresscity))) AS address, i.datetimeassigned, STUFF((SELECT ', ' + LTRIM(RTRIM(so.offensetag)) FROM offense so, incident si WHERE so.eventtype = 10 AND so.eventkey = si.incidentkey AND si.incidentkey = i.incidentkey FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, '') AS details
              FROM animlink alink, incident i, address a, addrlink ad
              WHERE ad.eventtype = 10
              AND a.addresskey = ad.addrlinkaddresskey
              AND ad.eventkey = i.incidentkey
              AND alink.eventkey = i.incidentkey
              AND alink.eventtype = 10
              AND alink.animalkey = ?;";
        $execute_values = array($animal_key);
        return $this->shelterpro->run_query($q, $execute_values);
    }

    /**
     * @param $person_key
     *
     * @return mixed
     */
    public function query_person_dogs($person_key)
    {
        $q = "SELECT petname, breed1 AS breed, gender, lastsavedatetime
        FROM animal
        WHERE persownr = ?";

        return $this->shelterpro->run_query($q, array($person_key));
    }

    /**
     * @param $person_key
     *
     * @return mixed
     */
    public function query_person_charges($person_key)
    {
        $q = "SELECT c.chargedesc, c.chargedate, c.chargeamount, c.chargeprecinct, p.name AS Officer, n.notememo
        FROM charges c
        LEFT JOIN person p ON c.addedbyuser = p.personkey
        LEFT JOIN note n ON c.eventkey = n.eventkey AND n.eventtype = 5
        WHERE c.chargeperson = $person_key";
        return $this->shelterpro->run_query($q, null);
    }

    /**
     * @return mixed
     */
    public function query_animals()
    {
        if (!$this->authenticate_cookie()) {
            return null;
        }
        $q = "SELECT a.animalkey, a.breed1, a.petname, a.lastsavedatetime, p.name FROM animal a, person p WHERE p.personkey = a.persownr AND a.lastsavedatetime >= convert(DATETIME, '2016-01-01' ) AND NULLIF(a.petname, '') IS NOT NULL ;";
        return $this->shelterpro->run_query($q, null);
    }

    /**
     * @return mixed
     */
    public function query_people()
    {
        if (!$this->authenticate_cookie()) {
            return null;
        }
        $q = "SELECT personkey, fname, lname, home_ph, work_ph, third_ph, email, addeddatetime, lastsavedatetime FROM person WHERE lastsavedatetime >= convert(DATETIME, '2016-01-01' ) AND NULLIF(name, '') IS NOT NULL;";
        return $this->shelterpro->run_query($q, null);
    }

    /**
     * @param $searchValue
     * @param $searchType
     *
     * @return mixed
     */
    public function query_licenses($searchValue, $searchType)
    {
        if (!$this->authenticate_cookie()) {
            return null;
        }
        $value_Pair = array("tag_num" => "Tag_Num", "pet_name" => "Animal_Name", "breed" => "pet_breed_desc", "ower_name" => "ClientName1", "address" => "(Street_House_Num + ' ' + Street_Number + ' ' + Street_Name + ', ' + Street_Postal)", "area" => "Street_Area");
        if ($searchType == "all") {
            $q = "SELECT DISTINCT Account_Num, Animal_Name, ClientName1, pet_breed_desc, Tag_Num, Licence_Date, (Street_House_Num + ' ' + Street_Number + ' ' + Street_Name + ', ' + Street_Postal) as address, Phone1
              FROM dogtagsdetails
              WHERE Phone1 Like '%$searchValue%'
              OR Animal_Name Like '%$searchValue%'
              OR ClientName1 Like '%$searchValue%'
              OR Tag_Num Like '%$searchValue%'
              OR pet_breed_desc Like '%$searchValue%'
              OR (Street_House_Num + ' ' + Street_Number + ' ' + Street_Name + ', ' + Street_Postal) Like '%$searchValue%';";
        } else {
            $q = "SELECT DISTINCT Account_Num, Animal_Name, ClientName1, pet_breed_desc, Tag_Num, Licence_Date, (Street_House_Num + ' ' + Street_Number + ' ' + Street_Name + ', ' + Street_Postal) as address, Phone1
        FROM dogtagsdetails
        WHERE $value_Pair[$searchType] LIKE '%$searchValue%';";
        }
        return $this->vadim->run_query($q, null);
    }

    /**
     * @param $raw_username
     * @param $raw_password
     *
     * @return bool
     */
    public function log_in($raw_username, $raw_password)
    {
        $password = strtoupper($raw_password);
        $username = $this->parse_username($raw_username);
        try {
            //create array containing $user and $pass values
            $execute_values = array($username, $password);

            $query = "SELECT DISTINCT p.personkey, p.name, pu.password FROM person p, parmuser pu WHERE p.personkey = pu.personkey AND p.staff_ind = 1 AND p.name = ? AND pu.password = ? ;";
            //run query to return info for username/password combo
            $query_results = $this->shelterpro->run_query($query, $execute_values);

            //check to see if $query_results contains a record
            if (count($query_results) == 1) {
                //user record found
                //store the hashed version of $pass in $password_hash
                $password_hash = password_hash($password, PASSWORD_DEFAULT);
                //format cookies content as $user:$password_hash
                $cookie_content = base64_encode("$username:$password_hash");
                //set cookie named "usersession" and store $cookie_content for 8 hours (I.E a work day)
                setcookie("usersession", $cookie_content, time() + (8 * 3600), "/");
                //change location to be index.html
                return true;
            }
            return false;
        } catch (PDOException $e) {
            trigger_error('Login Error: ' . $e->getMessage(), E_USER_ERROR);
        }
        return false;
    }

    /**
     * @param $raw_username
     *
     * @return string
     */
    function parse_username($raw_username)
    {
        //checks to see if user contains a space
        if (strpos($raw_username, " ") > 0 && strpos($raw_username, ",") == 0) {
            list($first_name, $last_name) = explode(" ", $raw_username);
            $username = $last_name . ", " . $first_name;
        } else {
            $username = $raw_username;
        }
        return strtoupper($username);
    }

    /**
     * @return bool
     */
    public function authenticate_cookie()
    {
        if (isset($_COOKIE['usersession'])) {
            //store usersession cookie in $cookie variable
            $usersession_cookie = $_COOKIE['usersession'];
            //decode cookie using base64
            $cookie_content = base64_decode($usersession_cookie);
            //split the cookie cookie_content into a $username and $hashed_password variables
            list($username, $hashed_password) = explode(':', $cookie_content);
            //build an array containing the value of the username for prepared statement
            $execute_values = array($username);
            //run query looking for username in cookie
            $query_response = $this->shelterpro->run_query("SELECT DISTINCT pu.password FROM person p, parmuser pu WHERE p.personkey = pu.personkey AND p.staff_ind = 1 AND p.name = ?;", $execute_values);
            //pull password from results and store it in $password
            $password = $query_response[0]["password"];
            //final parsing of the password, removes any whitespace
            $password = str_replace(" ", "", $password);
            //verification step to see if password returned is the same as the hashed password
            if (password_verify($password, $hashed_password)) {
                return true;
            }
        }
        return false;
    }
}
