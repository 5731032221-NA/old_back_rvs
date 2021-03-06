toc.dat                                                                                             0000600 0004000 0002000 00000071332 14006526610 0014445 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP       7                    y            rvspms    13.0    13.0 N    z           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false         {           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false         |           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false         }           1262    16394    rvspms    DATABASE     a   CREATE DATABASE rvspms WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Thai_Thailand.874';
    DROP DATABASE rvspms;
                postgres    false                     2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                postgres    false         ~           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   postgres    false    3         ?            1255    16624    check_prefix(character varying)    FUNCTION     f  CREATE FUNCTION public.check_prefix("params$" character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
declare 
   isTableExist boolean;   
   istables text;
begin
  select prefix 
  into istables
  from (
		select prefix 		
		from validmst				
	) as s
  where prefix = params$;	
  isTableExist = istables <> '';
 return isTableExist; 
 end;
 $_$;
 @   DROP FUNCTION public.check_prefix("params$" character varying);
       public          postgres    false    3         ?            1255    16562 '   check_table_existing(character varying)    FUNCTION     ?  CREATE FUNCTION public.check_table_existing("tbname$" character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
declare 
   isTableExist boolean;   
   istables text;
begin
  select tablename 
  into istables
  from (
		select tablename 		
		from pg_catalog.pg_tables
		where schemaname != 'pg_catalog'
		and schemaname != 'information_schema'
	) as s
  where tablename = tbname$;	
  isTableExist = istables <> '';
 return isTableExist;
 end;
 $_$;
 H   DROP FUNCTION public.check_table_existing("tbname$" character varying);
       public          postgres    false    3         ?            1259    16640    category    TABLE     _   CREATE TABLE public.category (
    id integer NOT NULL,
    name character varying NOT NULL
);
    DROP TABLE public.category;
       public         heap    postgres    false    3         ?            1259    16638    category_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.category_id_seq;
       public          postgres    false    3    217                    0    0    category_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;
          public          postgres    false    216         ?            1259    16421    cfgmst_id_seq    SEQUENCE     v   CREATE SEQUENCE public.cfgmst_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.cfgmst_id_seq;
       public          postgres    false    3         ?            1259    16423    cfgmst    TABLE     "  CREATE TABLE public.cfgmst (
    cfgmstid integer DEFAULT nextval('public.cfgmst_id_seq'::regclass) NOT NULL,
    listname character varying(200) NOT NULL,
    parent character varying(200) DEFAULT NULL::bpchar,
    description character varying(255) DEFAULT NULL::character varying,
    recordstatus character(1),
    createdate timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    category character varying(200) DEFAULT NULL::character varying,
    value character varying(200),
    recordseq smallint,
    remark character varying(200)
);
    DROP TABLE public.cfgmst;
       public         heap    postgres    false    203    3         ?            1259    24927    channel    TABLE     ?   CREATE TABLE public.channel (
    channelid integer NOT NULL,
    key character varying(100) NOT NULL,
    name character varying(100)
);
    DROP TABLE public.channel;
       public         heap    postgres    false    3         ?            1259    24998    cmgpmst_id_seq    SEQUENCE     w   CREATE SEQUENCE public.cmgpmst_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.cmgpmst_id_seq;
       public          postgres    false    3         ?            1259    24996    cmpgdtl_id_seq    SEQUENCE     w   CREATE SEQUENCE public.cmpgdtl_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.cmpgdtl_id_seq;
       public          postgres    false    3         ?            1259    24893    cmpgdtl    TABLE     ?  CREATE TABLE public.cmpgdtl (
    cmpgdtlid integer DEFAULT nextval('public.cmpgdtl_id_seq'::regclass) NOT NULL,
    strdate timestamp with time zone,
    strtime time with time zone,
    enddate timestamp with time zone,
    endtime time with time zone,
    validfrom date,
    validto date,
    description character varying(255),
    note text,
    qty integer,
    promotype character varying(100),
    recurringflag character varying(100),
    validoption character varying(100) DEFAULT NULL::character varying,
    frequency smallint,
    onday character varying(100),
    onthe integer,
    status character(1),
    mkt character varying,
    source character varying,
    channel character varying,
    profiles character varying,
    remark text,
    cmpgmstid integer,
    indefinitely boolean,
    amnt integer,
    disc integer,
    minamnt smallint,
    maxamnt smallint,
    minpurchase smallint,
    maxpurchase smallint,
    actqty smallint,
    usedqty smallint,
    qtyforevery smallint
);
    DROP TABLE public.cmpgdtl;
       public         heap    postgres    false    233    3         ?           0    0    COLUMN cmpgdtl.onthe    COMMENT     ?   COMMENT ON COLUMN public.cmpgdtl.onthe IS 'วัน อาทิตย์ ถึง เสาร์ โดยกำหนดให้เป็นวันเริ่มต้น campaing
1 = first
2 = second
3 = third
4 = fourth

5 = last
';
          public          postgres    false    224         ?            1259    24994    cmstid_id_seq    SEQUENCE     v   CREATE SEQUENCE public.cmstid_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.cmstid_id_seq;
       public          postgres    false    3         ?            1259    24890    cmpgmst    TABLE     ?  CREATE TABLE public.cmpgmst (
    cmpgmstid integer DEFAULT nextval('public.cmstid_id_seq'::regclass) NOT NULL,
    name character varying(255) NOT NULL,
    detail text,
    status character(1),
    remark text DEFAULT 'n/a'::text,
    strtime time with time zone,
    endtime time with time zone,
    strdate timestamp with time zone,
    enddate timestamp with time zone,
    qtyeachtime smallint,
    brandcode character varying,
    indefinitely boolean
);
    DROP TABLE public.cmpgmst;
       public         heap    postgres    false    232    3         ?           0    0    COLUMN cmpgmst.status    COMMENT     M   COMMENT ON COLUMN public.cmpgmst.status IS 'Y = Active
N = Inactive
Def: N';
          public          postgres    false    223         ?           0    0    COLUMN cmpgmst.remark    COMMENT     ?   COMMENT ON COLUMN public.cmpgmst.remark IS 'remark  delete เมื่อทำการลบ campaign และ update status เป็น N';
          public          postgres    false    223         ?            1259    24984    codemst    TABLE     ?  CREATE TABLE public.codemst (
    cmstid integer DEFAULT nextval('public.cmstid_id_seq'::regclass) NOT NULL,
    promocode character varying(100),
    strdate timestamp with time zone,
    enddate timestamp with time zone,
    qty smallint,
    cmpgdtlid integer,
    mkt character varying,
    source character varying,
    channel character varying,
    profiles character varying,
    status character(1),
    remark character varying
);
    DROP TABLE public.codemst;
       public         heap    postgres    false    232    3         ?            1259    16395    componentmst    TABLE     ?  CREATE TABLE public.componentmst (
    componentid character(30),
    name character varying(200) DEFAULT NULL::character varying,
    "position" smallint,
    seq smallint,
    state character varying(50) DEFAULT NULL::character varying,
    parent character(30),
    icon character varying(200),
    slug character varying(200),
    version character varying(50),
    createddtm timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
     DROP TABLE public.componentmst;
       public         heap    postgres    false    3         ?            1259    25000    coupon_voucher_qty_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.coupon_voucher_qty_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.coupon_voucher_qty_id_seq;
       public          postgres    false    3         ?            1259    24896    couponvoucherqty    TABLE     ?  CREATE TABLE public.couponvoucherqty (
    cpnvchqtyid integer NOT NULL,
    cmpgdtlid integer NOT NULL,
    promocode character varying(255) NOT NULL,
    strdate date,
    strtime time with time zone,
    enddate date,
    endtime time with time zone,
    allocateqty smallint,
    usedqty smallint,
    utilizeqty smallint,
    sttodrid smallint,
    note character varying(255),
    cmstid integer
);
 $   DROP TABLE public.couponvoucherqty;
       public         heap    postgres    false    3         ?           0    0     COLUMN couponvoucherqty.sttodrid    COMMENT     ?   COMMENT ON COLUMN public.couponvoucherqty.sttodrid IS '1 = X( Exception for manual generate)
2 = A (Auto generate by system)
99 = Inactive';
          public          postgres    false    225         ?            1259    16698    logb_id_seq    SEQUENCE     |   CREATE SEQUENCE public.logb_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;
 "   DROP SEQUENCE public.logb_id_seq;
       public          postgres    false    3         ?            1259    16464    logsb    TABLE     a  CREATE TABLE public.logsb (
    "timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    information text,
    logbid integer DEFAULT nextval('public.logb_id_seq'::regclass),
    function character varying,
    action character varying,
    "user" character varying,
    designation character varying,
    " changedfrom" character varying
);
    DROP TABLE public.logsb;
       public         heap    postgres    false    221    3         ?            1259    24917    market    TABLE     ?   CREATE TABLE public.market (
    mktid integer NOT NULL,
    key character varying(100) NOT NULL,
    name character varying(100)
);
    DROP TABLE public.market;
       public         heap    postgres    false    3         ?            1259    16629    post    TABLE     t   CREATE TABLE public.post (
    id integer NOT NULL,
    title character varying NOT NULL,
    text text NOT NULL
);
    DROP TABLE public.post;
       public         heap    postgres    false    3         ?            1259    16649    post_categories_category    TABLE     s   CREATE TABLE public.post_categories_category (
    "postId" integer NOT NULL,
    "categoryId" integer NOT NULL
);
 ,   DROP TABLE public.post_categories_category;
       public         heap    postgres    false    3         ?            1259    16627    post_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.post_id_seq;
       public          postgres    false    215    3         ?           0    0    post_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.post_id_seq OWNED BY public.post.id;
          public          postgres    false    214         ?            1259    24932    profiles    TABLE     l   CREATE TABLE public.profiles (
    profilesid integer NOT NULL,
    name character varying(100) NOT NULL
);
    DROP TABLE public.profiles;
       public         heap    postgres    false    3         ?            1259    16507    propertymst    TABLE     ?  CREATE TABLE public.propertymst (
    propertycode character varying(20) NOT NULL,
    propertyname character varying(200) DEFAULT NULL::bpchar,
    customerid character varying(200) DEFAULT NULL::bpchar,
    chaincode character varying(200) DEFAULT NULL::bpchar,
    brandcode character varying(200) DEFAULT NULL::bpchar,
    starrating character varying(200) DEFAULT NULL::bpchar,
    city character varying(200) DEFAULT NULL::bpchar,
    postalcode character varying(255) DEFAULT NULL::character varying,
    roomcount integer,
    timezone character varying(255) DEFAULT NULL::character varying,
    streetaddress text,
    areacitycode character varying(10) DEFAULT NULL::bpchar,
    countrycode character varying(10) DEFAULT NULL::bpchar,
    propertypicture text,
    propetystatus character varying(200) DEFAULT NULL::bpchar,
    remark text,
    createdtmsp timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.propertymst;
       public         heap    postgres    false    3         ?            1259    16419    rminv_id_seq    SEQUENCE     u   CREATE SEQUENCE public.rminv_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.rminv_id_seq;
       public          postgres    false    3         ?            1259    16460    rminv    TABLE     >  CREATE TABLE public.rminv (
    monthyear character(8),
    rmtype character varying(200),
    "1" smallint,
    "2" smallint,
    "3" smallint,
    "4" smallint,
    "5" smallint,
    "6" smallint,
    "7" smallint,
    "8" smallint,
    "9" smallint,
    "10" smallint,
    "11" smallint,
    "12" smallint,
    "13" smallint,
    "14" smallint,
    "15" smallint,
    "16" smallint,
    "17" smallint,
    "18" smallint,
    "19" smallint,
    "20" smallint,
    "21" smallint,
    "22" smallint,
    "23" smallint,
    "24" smallint,
    "25" smallint,
    "26" smallint,
    "27" smallint,
    "28" smallint,
    "29" smallint,
    "30" smallint,
    "31" smallint,
    rminvid integer DEFAULT nextval('public.rminv_id_seq'::regclass) NOT NULL,
    CONSTRAINT "CHK_5dc9434d871d5055b1a20f07ba" CHECK ((rmtype IS NOT NULL))
);
    DROP TABLE public.rminv;
       public         heap    postgres    false    202    3         ?            1259    16434    rmmst    TABLE     ?  CREATE TABLE public.rmmst (
    rmproperty character varying(200) NOT NULL,
    rmno character varying(200) DEFAULT NULL::bpchar,
    rmtypeid character varying(200) DEFAULT NULL::bpchar,
    floorid character varying(200) DEFAULT NULL::bpchar,
    buildingid character varying(200) DEFAULT NULL::bpchar,
    wingid character varying(200) DEFAULT NULL::bpchar,
    exposureid character varying(200) DEFAULT NULL::bpchar,
    rmdesc character varying(255) DEFAULT NULL::character varying,
    rmsqsize character varying(255) DEFAULT NULL::character varying,
    rmseq integer,
    rmstatus character varying(200) DEFAULT NULL::bpchar,
    rmattribute text
);
    DROP TABLE public.rmmst;
       public         heap    postgres    false    3         ?            1259    24922    source    TABLE     ?   CREATE TABLE public.source (
    scourceid integer NOT NULL,
    key character varying(100) NOT NULL,
    name character varying(100)
);
    DROP TABLE public.source;
       public         heap    postgres    false    3         ?            1259    24937    statusodermst    TABLE     g   CREATE TABLE public.statusodermst (
    sttodrid smallint NOT NULL,
    name character varying(200)
);
 !   DROP TABLE public.statusodermst;
       public         heap    postgres    false    3         ?            1259    16536 	   tablelist    TABLE     ?   CREATE TABLE public.tablelist (
    schemaname name,
    tablename name,
    tableowner name,
    tablespace name,
    hasindexes boolean,
    hasrules boolean,
    hastriggers boolean,
    rowsecurity boolean
);
    DROP TABLE public.tablelist;
       public         heap    postgres    false    3         ?            1259    16539 
   tablelists    TABLE     7   CREATE TABLE public.tablelists (
    tablename name
);
    DROP TABLE public.tablelists;
       public         heap    postgres    false    3         ?            1259    16449    username_id_seq    SEQUENCE     x   CREATE SEQUENCE public.username_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.username_id_seq;
       public          postgres    false    3         ?            1259    16451    username    TABLE     7  CREATE TABLE public.username (
    id integer DEFAULT nextval('public.username_id_seq'::regclass) NOT NULL,
    firstname character varying(100),
    lastname character varying(100),
    age smallint,
    status_record character varying(50),
    status_marriaged character(1),
    remark character varying(200),
    userid character(10) DEFAULT NULL::bpchar,
    password character varying(255),
    property character varying(20),
    branch character varying(20),
    role character varying(100) DEFAULT NULL::character varying,
    prefix character varying(20)
);
    DROP TABLE public.username;
       public         heap    postgres    false    206    3         ?            1259    16410    usrpermissionmst    TABLE     X  CREATE TABLE public.usrpermissionmst (
    propertyid character varying(20),
    branchid character varying(20),
    userid character varying(20),
    usrpermission character varying(255),
    dev character varying(20),
    beta character varying(20),
    status character varying(20),
    roles character varying(100),
    usrpmmid integer
);
 $   DROP TABLE public.usrpermissionmst;
       public         heap    postgres    false    3         ?            1259    16686    valid    TABLE     ^   CREATE TABLE public.valid (
    id integer NOT NULL,
    prefix character varying NOT NULL
);
    DROP TABLE public.valid;
       public         heap    postgres    false    3         ?            1259    16684    valid_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.valid_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.valid_id_seq;
       public          postgres    false    3    220         ?           0    0    valid_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.valid_id_seq OWNED BY public.valid.id;
          public          postgres    false    219         ?            1259    16609    validmst    TABLE     S   CREATE TABLE public.validmst (
    prefix character varying(20),
    id integer
);
    DROP TABLE public.validmst;
       public         heap    postgres    false    3         ?            1259    24887    voucher    TABLE     ?   CREATE TABLE public.voucher (
    qtyid integer NOT NULL,
    vouchertoken character varying(255) NOT NULL,
    used character(1) NOT NULL,
    active character(1) NOT NULL,
    note character varying(255)
);
    DROP TABLE public.voucher;
       public         heap    postgres    false    3         ?           0    0    COLUMN voucher.used    COMMENT     I   COMMENT ON COLUMN public.voucher.used IS 'Y = used
N = Not use
def = N';
          public          postgres    false    222         ?           0    0    COLUMN voucher.active    COMMENT     N   COMMENT ON COLUMN public.voucher.active IS 'Y = Active
N = Inactive
Def = Y';
          public          postgres    false    222         ?           2604    16643    category id    DEFAULT     j   ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);
 :   ALTER TABLE public.category ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    217    217         ?           2604    16632    post id    DEFAULT     b   ALTER TABLE ONLY public.post ALTER COLUMN id SET DEFAULT nextval('public.post_id_seq'::regclass);
 6   ALTER TABLE public.post ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214    215         ?           2604    16689    valid id    DEFAULT     d   ALTER TABLE ONLY public.valid ALTER COLUMN id SET DEFAULT nextval('public.valid_id_seq'::regclass);
 7   ALTER TABLE public.valid ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220         ?           2606    16694 $   valid PK_33ef6970f0c414947525fb23ee6 
   CONSTRAINT     d   ALTER TABLE ONLY public.valid
    ADD CONSTRAINT "PK_33ef6970f0c414947525fb23ee6" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.valid DROP CONSTRAINT "PK_33ef6970f0c414947525fb23ee6";
       public            postgres    false    220         ?           2606    16653 7   post_categories_category PK_91306c0021c4901c1825ef097ce 
   CONSTRAINT     ?   ALTER TABLE ONLY public.post_categories_category
    ADD CONSTRAINT "PK_91306c0021c4901c1825ef097ce" PRIMARY KEY ("postId", "categoryId");
 c   ALTER TABLE ONLY public.post_categories_category DROP CONSTRAINT "PK_91306c0021c4901c1825ef097ce";
       public            postgres    false    218    218         ?           2606    16648 '   category PK_9c4e4a89e3674fc9f382d733f03 
   CONSTRAINT     g   ALTER TABLE ONLY public.category
    ADD CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY (id);
 S   ALTER TABLE ONLY public.category DROP CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03";
       public            postgres    false    217         ?           2606    16637 #   post PK_be5fda3aac270b134ff9c21cdee 
   CONSTRAINT     c   ALTER TABLE ONLY public.post
    ADD CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY (id);
 O   ALTER TABLE ONLY public.post DROP CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee";
       public            postgres    false    215         ?           2606    24931    channel channel_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.channel
    ADD CONSTRAINT channel_pkey PRIMARY KEY (channelid);
 >   ALTER TABLE ONLY public.channel DROP CONSTRAINT channel_pkey;
       public            postgres    false    228         ?           2606    24908    cmpgdtl cmpgdtl_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.cmpgdtl
    ADD CONSTRAINT cmpgdtl_pkey PRIMARY KEY (cmpgdtlid);
 >   ALTER TABLE ONLY public.cmpgdtl DROP CONSTRAINT cmpgdtl_pkey;
       public            postgres    false    224         ?           2606    24900    cmpgmst cmpgmst_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.cmpgmst
    ADD CONSTRAINT cmpgmst_pkey PRIMARY KEY (cmpgmstid);
 >   ALTER TABLE ONLY public.cmpgmst DROP CONSTRAINT cmpgmst_pkey;
       public            postgres    false    223         ?           2606    24988    codemst codemst_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public.codemst
    ADD CONSTRAINT codemst_pkey PRIMARY KEY (cmstid) INCLUDE (cmstid);
 >   ALTER TABLE ONLY public.codemst DROP CONSTRAINT codemst_pkey;
       public            postgres    false    231    231         ?           2606    24968 &   couponvoucherqty couponvoucherqty_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY public.couponvoucherqty
    ADD CONSTRAINT couponvoucherqty_pkey PRIMARY KEY (cpnvchqtyid);
 P   ALTER TABLE ONLY public.couponvoucherqty DROP CONSTRAINT couponvoucherqty_pkey;
       public            postgres    false    225         ?           2606    24921    market market_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.market
    ADD CONSTRAINT market_pkey PRIMARY KEY (mktid);
 <   ALTER TABLE ONLY public.market DROP CONSTRAINT market_pkey;
       public            postgres    false    226         ?           2606    24936    profiles profilesid_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profilesid_pkey PRIMARY KEY (profilesid);
 B   ALTER TABLE ONLY public.profiles DROP CONSTRAINT profilesid_pkey;
       public            postgres    false    229         ?           2606    24926    source source_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.source
    ADD CONSTRAINT source_pkey PRIMARY KEY (scourceid);
 <   ALTER TABLE ONLY public.source DROP CONSTRAINT source_pkey;
       public            postgres    false    227         ?           2606    24941     statusodermst statusodermst_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.statusodermst
    ADD CONSTRAINT statusodermst_pkey PRIMARY KEY (sttodrid);
 J   ALTER TABLE ONLY public.statusodermst DROP CONSTRAINT statusodermst_pkey;
       public            postgres    false    230         ?           2606    24916    voucher voucher_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.voucher
    ADD CONSTRAINT voucher_pkey PRIMARY KEY (vouchertoken);
 >   ALTER TABLE ONLY public.voucher DROP CONSTRAINT voucher_pkey;
       public            postgres    false    222         ?           1259    16654    IDX_93b566d522b73cb8bc46f7405b    INDEX     i   CREATE INDEX "IDX_93b566d522b73cb8bc46f7405b" ON public.post_categories_category USING btree ("postId");
 4   DROP INDEX public."IDX_93b566d522b73cb8bc46f7405b";
       public            postgres    false    218         ?           1259    16655    IDX_a5e63f80ca58e7296d5864bd2d    INDEX     m   CREATE INDEX "IDX_a5e63f80ca58e7296d5864bd2d" ON public.post_categories_category USING btree ("categoryId");
 4   DROP INDEX public."IDX_a5e63f80ca58e7296d5864bd2d";
       public            postgres    false    218         ?           2606    16656 7   post_categories_category FK_93b566d522b73cb8bc46f7405bd    FK CONSTRAINT     ?   ALTER TABLE ONLY public.post_categories_category
    ADD CONSTRAINT "FK_93b566d522b73cb8bc46f7405bd" FOREIGN KEY ("postId") REFERENCES public.post(id) ON DELETE CASCADE;
 c   ALTER TABLE ONLY public.post_categories_category DROP CONSTRAINT "FK_93b566d522b73cb8bc46f7405bd";
       public          postgres    false    218    3027    215         ?           2606    16661 7   post_categories_category FK_a5e63f80ca58e7296d5864bd2d3    FK CONSTRAINT     ?   ALTER TABLE ONLY public.post_categories_category
    ADD CONSTRAINT "FK_a5e63f80ca58e7296d5864bd2d3" FOREIGN KEY ("categoryId") REFERENCES public.category(id) ON DELETE CASCADE;
 c   ALTER TABLE ONLY public.post_categories_category DROP CONSTRAINT "FK_a5e63f80ca58e7296d5864bd2d3";
       public          postgres    false    217    218    3029         ?           2606    24969    couponvoucherqty cmpgdtlid    FK CONSTRAINT     ?   ALTER TABLE ONLY public.couponvoucherqty
    ADD CONSTRAINT cmpgdtlid FOREIGN KEY (cpnvchqtyid) REFERENCES public.cmpgdtl(cmpgdtlid) NOT VALID;
 D   ALTER TABLE ONLY public.couponvoucherqty DROP CONSTRAINT cmpgdtlid;
       public          postgres    false    3041    225    224         ?           2606    24989    couponvoucherqty cmstid    FK CONSTRAINT     ?   ALTER TABLE ONLY public.couponvoucherqty
    ADD CONSTRAINT cmstid FOREIGN KEY (cmstid) REFERENCES public.codemst(cmstid) NOT VALID;
 A   ALTER TABLE ONLY public.couponvoucherqty DROP CONSTRAINT cmstid;
       public          postgres    false    3055    231    225         ?           2606    24979    voucher cpnvchqtyid    FK CONSTRAINT     ?   ALTER TABLE ONLY public.voucher
    ADD CONSTRAINT cpnvchqtyid FOREIGN KEY (qtyid) REFERENCES public.couponvoucherqty(cpnvchqtyid) NOT VALID;
 =   ALTER TABLE ONLY public.voucher DROP CONSTRAINT cpnvchqtyid;
       public          postgres    false    225    3043    222         ?           2606    24974    couponvoucherqty sttodrid    FK CONSTRAINT     ?   ALTER TABLE ONLY public.couponvoucherqty
    ADD CONSTRAINT sttodrid FOREIGN KEY (cpnvchqtyid) REFERENCES public.statusodermst(sttodrid) NOT VALID;
 C   ALTER TABLE ONLY public.couponvoucherqty DROP CONSTRAINT sttodrid;
       public          postgres    false    225    230    3053                                                                                                                                                                                                                                                                                                              restore.sql                                                                                         0000600 0004000 0002000 00000057271 14006526610 0015400 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 13.0
-- Dumped by pg_dump version 13.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE rvspms;
--
-- Name: rvspms; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE rvspms WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Thai_Thailand.874';


ALTER DATABASE rvspms OWNER TO postgres;

\connect rvspms

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: check_prefix(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_prefix("params$" character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
declare 
   isTableExist boolean;   
   istables text;
begin
  select prefix 
  into istables
  from (
		select prefix 		
		from validmst				
	) as s
  where prefix = params$;	
  isTableExist = istables <> '';
 return isTableExist; 
 end;
 $_$;


ALTER FUNCTION public.check_prefix("params$" character varying) OWNER TO postgres;

--
-- Name: check_table_existing(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_table_existing("tbname$" character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$
declare 
   isTableExist boolean;   
   istables text;
begin
  select tablename 
  into istables
  from (
		select tablename 		
		from pg_catalog.pg_tables
		where schemaname != 'pg_catalog'
		and schemaname != 'information_schema'
	) as s
  where tablename = tbname$;	
  isTableExist = istables <> '';
 return isTableExist;
 end;
 $_$;


ALTER FUNCTION public.check_table_existing("tbname$" character varying) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.category OWNER TO postgres;

--
-- Name: category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.category_id_seq OWNER TO postgres;

--
-- Name: category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;


--
-- Name: cfgmst_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cfgmst_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cfgmst_id_seq OWNER TO postgres;

--
-- Name: cfgmst; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cfgmst (
    cfgmstid integer DEFAULT nextval('public.cfgmst_id_seq'::regclass) NOT NULL,
    listname character varying(200) NOT NULL,
    parent character varying(200) DEFAULT NULL::bpchar,
    description character varying(255) DEFAULT NULL::character varying,
    recordstatus character(1),
    createdate timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    category character varying(200) DEFAULT NULL::character varying,
    value character varying(200),
    recordseq smallint,
    remark character varying(200)
);


ALTER TABLE public.cfgmst OWNER TO postgres;

--
-- Name: channel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.channel (
    channelid integer NOT NULL,
    key character varying(100) NOT NULL,
    name character varying(100)
);


ALTER TABLE public.channel OWNER TO postgres;

--
-- Name: cmgpmst_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cmgpmst_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cmgpmst_id_seq OWNER TO postgres;

--
-- Name: cmpgdtl_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cmpgdtl_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cmpgdtl_id_seq OWNER TO postgres;

--
-- Name: cmpgdtl; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cmpgdtl (
    cmpgdtlid integer DEFAULT nextval('public.cmpgdtl_id_seq'::regclass) NOT NULL,
    strdate timestamp with time zone,
    strtime time with time zone,
    enddate timestamp with time zone,
    endtime time with time zone,
    validfrom date,
    validto date,
    description character varying(255),
    note text,
    qty integer,
    promotype character varying(100),
    recurringflag character varying(100),
    validoption character varying(100) DEFAULT NULL::character varying,
    frequency smallint,
    onday character varying(100),
    onthe integer,
    status character(1),
    mkt character varying,
    source character varying,
    channel character varying,
    profiles character varying,
    remark text,
    cmpgmstid integer,
    indefinitely boolean,
    amnt integer,
    disc integer,
    minamnt smallint,
    maxamnt smallint,
    minpurchase smallint,
    maxpurchase smallint,
    actqty smallint,
    usedqty smallint,
    qtyforevery smallint
);


ALTER TABLE public.cmpgdtl OWNER TO postgres;

--
-- Name: COLUMN cmpgdtl.onthe; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.cmpgdtl.onthe IS 'วัน อาทิตย์ ถึง เสาร์ โดยกำหนดให้เป็นวันเริ่มต้น campaing
1 = first
2 = second
3 = third
4 = fourth

5 = last
';


--
-- Name: cmstid_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cmstid_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cmstid_id_seq OWNER TO postgres;

--
-- Name: cmpgmst; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cmpgmst (
    cmpgmstid integer DEFAULT nextval('public.cmstid_id_seq'::regclass) NOT NULL,
    name character varying(255) NOT NULL,
    detail text,
    status character(1),
    remark text DEFAULT 'n/a'::text,
    strtime time with time zone,
    endtime time with time zone,
    strdate timestamp with time zone,
    enddate timestamp with time zone,
    qtyeachtime smallint,
    brandcode character varying,
    indefinitely boolean
);


ALTER TABLE public.cmpgmst OWNER TO postgres;

--
-- Name: COLUMN cmpgmst.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.cmpgmst.status IS 'Y = Active
N = Inactive
Def: N';


--
-- Name: COLUMN cmpgmst.remark; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.cmpgmst.remark IS 'remark  delete เมื่อทำการลบ campaign และ update status เป็น N';


--
-- Name: codemst; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.codemst (
    cmstid integer DEFAULT nextval('public.cmstid_id_seq'::regclass) NOT NULL,
    promocode character varying(100),
    strdate timestamp with time zone,
    enddate timestamp with time zone,
    qty smallint,
    cmpgdtlid integer,
    mkt character varying,
    source character varying,
    channel character varying,
    profiles character varying,
    status character(1),
    remark character varying
);


ALTER TABLE public.codemst OWNER TO postgres;

--
-- Name: componentmst; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.componentmst (
    componentid character(30),
    name character varying(200) DEFAULT NULL::character varying,
    "position" smallint,
    seq smallint,
    state character varying(50) DEFAULT NULL::character varying,
    parent character(30),
    icon character varying(200),
    slug character varying(200),
    version character varying(50),
    createddtm timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.componentmst OWNER TO postgres;

--
-- Name: coupon_voucher_qty_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coupon_voucher_qty_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.coupon_voucher_qty_id_seq OWNER TO postgres;

--
-- Name: couponvoucherqty; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.couponvoucherqty (
    cpnvchqtyid integer NOT NULL,
    cmpgdtlid integer NOT NULL,
    promocode character varying(255) NOT NULL,
    strdate date,
    strtime time with time zone,
    enddate date,
    endtime time with time zone,
    allocateqty smallint,
    usedqty smallint,
    utilizeqty smallint,
    sttodrid smallint,
    note character varying(255),
    cmstid integer
);


ALTER TABLE public.couponvoucherqty OWNER TO postgres;

--
-- Name: COLUMN couponvoucherqty.sttodrid; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.couponvoucherqty.sttodrid IS '1 = X( Exception for manual generate)
2 = A (Auto generate by system)
99 = Inactive';


--
-- Name: logb_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.logb_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.logb_id_seq OWNER TO postgres;

--
-- Name: logsb; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logsb (
    "timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    information text,
    logbid integer DEFAULT nextval('public.logb_id_seq'::regclass),
    function character varying,
    action character varying,
    "user" character varying,
    designation character varying,
    " changedfrom" character varying
);


ALTER TABLE public.logsb OWNER TO postgres;

--
-- Name: market; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.market (
    mktid integer NOT NULL,
    key character varying(100) NOT NULL,
    name character varying(100)
);


ALTER TABLE public.market OWNER TO postgres;

--
-- Name: post; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post (
    id integer NOT NULL,
    title character varying NOT NULL,
    text text NOT NULL
);


ALTER TABLE public.post OWNER TO postgres;

--
-- Name: post_categories_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.post_categories_category (
    "postId" integer NOT NULL,
    "categoryId" integer NOT NULL
);


ALTER TABLE public.post_categories_category OWNER TO postgres;

--
-- Name: post_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.post_id_seq OWNER TO postgres;

--
-- Name: post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.post_id_seq OWNED BY public.post.id;


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    profilesid integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: propertymst; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.propertymst (
    propertycode character varying(20) NOT NULL,
    propertyname character varying(200) DEFAULT NULL::bpchar,
    customerid character varying(200) DEFAULT NULL::bpchar,
    chaincode character varying(200) DEFAULT NULL::bpchar,
    brandcode character varying(200) DEFAULT NULL::bpchar,
    starrating character varying(200) DEFAULT NULL::bpchar,
    city character varying(200) DEFAULT NULL::bpchar,
    postalcode character varying(255) DEFAULT NULL::character varying,
    roomcount integer,
    timezone character varying(255) DEFAULT NULL::character varying,
    streetaddress text,
    areacitycode character varying(10) DEFAULT NULL::bpchar,
    countrycode character varying(10) DEFAULT NULL::bpchar,
    propertypicture text,
    propetystatus character varying(200) DEFAULT NULL::bpchar,
    remark text,
    createdtmsp timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.propertymst OWNER TO postgres;

--
-- Name: rminv_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rminv_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rminv_id_seq OWNER TO postgres;

--
-- Name: rminv; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rminv (
    monthyear character(8),
    rmtype character varying(200),
    "1" smallint,
    "2" smallint,
    "3" smallint,
    "4" smallint,
    "5" smallint,
    "6" smallint,
    "7" smallint,
    "8" smallint,
    "9" smallint,
    "10" smallint,
    "11" smallint,
    "12" smallint,
    "13" smallint,
    "14" smallint,
    "15" smallint,
    "16" smallint,
    "17" smallint,
    "18" smallint,
    "19" smallint,
    "20" smallint,
    "21" smallint,
    "22" smallint,
    "23" smallint,
    "24" smallint,
    "25" smallint,
    "26" smallint,
    "27" smallint,
    "28" smallint,
    "29" smallint,
    "30" smallint,
    "31" smallint,
    rminvid integer DEFAULT nextval('public.rminv_id_seq'::regclass) NOT NULL,
    CONSTRAINT "CHK_5dc9434d871d5055b1a20f07ba" CHECK ((rmtype IS NOT NULL))
);


ALTER TABLE public.rminv OWNER TO postgres;

--
-- Name: rmmst; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rmmst (
    rmproperty character varying(200) NOT NULL,
    rmno character varying(200) DEFAULT NULL::bpchar,
    rmtypeid character varying(200) DEFAULT NULL::bpchar,
    floorid character varying(200) DEFAULT NULL::bpchar,
    buildingid character varying(200) DEFAULT NULL::bpchar,
    wingid character varying(200) DEFAULT NULL::bpchar,
    exposureid character varying(200) DEFAULT NULL::bpchar,
    rmdesc character varying(255) DEFAULT NULL::character varying,
    rmsqsize character varying(255) DEFAULT NULL::character varying,
    rmseq integer,
    rmstatus character varying(200) DEFAULT NULL::bpchar,
    rmattribute text
);


ALTER TABLE public.rmmst OWNER TO postgres;

--
-- Name: source; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.source (
    scourceid integer NOT NULL,
    key character varying(100) NOT NULL,
    name character varying(100)
);


ALTER TABLE public.source OWNER TO postgres;

--
-- Name: statusodermst; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.statusodermst (
    sttodrid smallint NOT NULL,
    name character varying(200)
);


ALTER TABLE public.statusodermst OWNER TO postgres;

--
-- Name: tablelist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tablelist (
    schemaname name,
    tablename name,
    tableowner name,
    tablespace name,
    hasindexes boolean,
    hasrules boolean,
    hastriggers boolean,
    rowsecurity boolean
);


ALTER TABLE public.tablelist OWNER TO postgres;

--
-- Name: tablelists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tablelists (
    tablename name
);


ALTER TABLE public.tablelists OWNER TO postgres;

--
-- Name: username_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.username_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.username_id_seq OWNER TO postgres;

--
-- Name: username; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.username (
    id integer DEFAULT nextval('public.username_id_seq'::regclass) NOT NULL,
    firstname character varying(100),
    lastname character varying(100),
    age smallint,
    status_record character varying(50),
    status_marriaged character(1),
    remark character varying(200),
    userid character(10) DEFAULT NULL::bpchar,
    password character varying(255),
    property character varying(20),
    branch character varying(20),
    role character varying(100) DEFAULT NULL::character varying,
    prefix character varying(20)
);


ALTER TABLE public.username OWNER TO postgres;

--
-- Name: usrpermissionmst; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usrpermissionmst (
    propertyid character varying(20),
    branchid character varying(20),
    userid character varying(20),
    usrpermission character varying(255),
    dev character varying(20),
    beta character varying(20),
    status character varying(20),
    roles character varying(100),
    usrpmmid integer
);


ALTER TABLE public.usrpermissionmst OWNER TO postgres;

--
-- Name: valid; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.valid (
    id integer NOT NULL,
    prefix character varying NOT NULL
);


ALTER TABLE public.valid OWNER TO postgres;

--
-- Name: valid_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.valid_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.valid_id_seq OWNER TO postgres;

--
-- Name: valid_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.valid_id_seq OWNED BY public.valid.id;


--
-- Name: validmst; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.validmst (
    prefix character varying(20),
    id integer
);


ALTER TABLE public.validmst OWNER TO postgres;

--
-- Name: voucher; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.voucher (
    qtyid integer NOT NULL,
    vouchertoken character varying(255) NOT NULL,
    used character(1) NOT NULL,
    active character(1) NOT NULL,
    note character varying(255)
);


ALTER TABLE public.voucher OWNER TO postgres;

--
-- Name: COLUMN voucher.used; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.voucher.used IS 'Y = used
N = Not use
def = N';


--
-- Name: COLUMN voucher.active; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.voucher.active IS 'Y = Active
N = Inactive
Def = Y';


--
-- Name: category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);


--
-- Name: post id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post ALTER COLUMN id SET DEFAULT nextval('public.post_id_seq'::regclass);


--
-- Name: valid id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.valid ALTER COLUMN id SET DEFAULT nextval('public.valid_id_seq'::regclass);


--
-- Name: valid PK_33ef6970f0c414947525fb23ee6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.valid
    ADD CONSTRAINT "PK_33ef6970f0c414947525fb23ee6" PRIMARY KEY (id);


--
-- Name: post_categories_category PK_91306c0021c4901c1825ef097ce; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_categories_category
    ADD CONSTRAINT "PK_91306c0021c4901c1825ef097ce" PRIMARY KEY ("postId", "categoryId");


--
-- Name: category PK_9c4e4a89e3674fc9f382d733f03; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY (id);


--
-- Name: post PK_be5fda3aac270b134ff9c21cdee; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY (id);


--
-- Name: channel channel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.channel
    ADD CONSTRAINT channel_pkey PRIMARY KEY (channelid);


--
-- Name: cmpgdtl cmpgdtl_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cmpgdtl
    ADD CONSTRAINT cmpgdtl_pkey PRIMARY KEY (cmpgdtlid);


--
-- Name: cmpgmst cmpgmst_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cmpgmst
    ADD CONSTRAINT cmpgmst_pkey PRIMARY KEY (cmpgmstid);


--
-- Name: codemst codemst_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.codemst
    ADD CONSTRAINT codemst_pkey PRIMARY KEY (cmstid) INCLUDE (cmstid);


--
-- Name: couponvoucherqty couponvoucherqty_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.couponvoucherqty
    ADD CONSTRAINT couponvoucherqty_pkey PRIMARY KEY (cpnvchqtyid);


--
-- Name: market market_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.market
    ADD CONSTRAINT market_pkey PRIMARY KEY (mktid);


--
-- Name: profiles profilesid_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profilesid_pkey PRIMARY KEY (profilesid);


--
-- Name: source source_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.source
    ADD CONSTRAINT source_pkey PRIMARY KEY (scourceid);


--
-- Name: statusodermst statusodermst_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statusodermst
    ADD CONSTRAINT statusodermst_pkey PRIMARY KEY (sttodrid);


--
-- Name: voucher voucher_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voucher
    ADD CONSTRAINT voucher_pkey PRIMARY KEY (vouchertoken);


--
-- Name: IDX_93b566d522b73cb8bc46f7405b; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_93b566d522b73cb8bc46f7405b" ON public.post_categories_category USING btree ("postId");


--
-- Name: IDX_a5e63f80ca58e7296d5864bd2d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_a5e63f80ca58e7296d5864bd2d" ON public.post_categories_category USING btree ("categoryId");


--
-- Name: post_categories_category FK_93b566d522b73cb8bc46f7405bd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_categories_category
    ADD CONSTRAINT "FK_93b566d522b73cb8bc46f7405bd" FOREIGN KEY ("postId") REFERENCES public.post(id) ON DELETE CASCADE;


--
-- Name: post_categories_category FK_a5e63f80ca58e7296d5864bd2d3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.post_categories_category
    ADD CONSTRAINT "FK_a5e63f80ca58e7296d5864bd2d3" FOREIGN KEY ("categoryId") REFERENCES public.category(id) ON DELETE CASCADE;


--
-- Name: couponvoucherqty cmpgdtlid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.couponvoucherqty
    ADD CONSTRAINT cmpgdtlid FOREIGN KEY (cpnvchqtyid) REFERENCES public.cmpgdtl(cmpgdtlid) NOT VALID;


--
-- Name: couponvoucherqty cmstid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.couponvoucherqty
    ADD CONSTRAINT cmstid FOREIGN KEY (cmstid) REFERENCES public.codemst(cmstid) NOT VALID;


--
-- Name: voucher cpnvchqtyid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voucher
    ADD CONSTRAINT cpnvchqtyid FOREIGN KEY (qtyid) REFERENCES public.couponvoucherqty(cpnvchqtyid) NOT VALID;


--
-- Name: couponvoucherqty sttodrid; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.couponvoucherqty
    ADD CONSTRAINT sttodrid FOREIGN KEY (cpnvchqtyid) REFERENCES public.statusodermst(sttodrid) NOT VALID;


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       