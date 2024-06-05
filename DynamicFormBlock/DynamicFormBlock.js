import Select from "react-select";
import { useEffect, useState } from "react";
import axios from "axios";
import validator from "validator";
import DynamicFormBlockItem from "./DynamicFormBlockItem";
import { Row } from "reactstrap";

const DynamicFormBlock = ({ formItem,title, strapi_url, backButtonLabel, nextButtonLabel, submitButtonLabel, submitInfo, submitDisclaimer, pageLabel,successMessage,processingLabel }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState(getInitialData(formItem));
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // console.log(pageLabel, "pagelabel");
  // console.log(formItem, "formItem");

  // const trial = formItem?.map(y => y?.fields?.flatMap(z => fields?.fieldName[mandatoryErrorMessage]))

  const trial = formItem?.flatMap(x => 
    x.fields?.reduce((acc, y) => {
        if (y.mandatoryErrorMessage) {
            acc[y.fieldname] = y.mandatoryErrorMessage;
        }
        return acc;
    }, {})
);

// Merge all objects into a single object
const mergedObject = trial.reduce((acc, obj) => {
    Object.assign(acc, obj);
    return acc;
}, {});

const mandatoryFields = Object.keys(mergedObject);

console.log(mergedObject,"mergedObject");



  console.log(trial,"trial")

  const count = formItem?.length;

  console.log(count, "countt");
  useEffect(() => {
    console.log(formData, "formData");
  }, [formData]);

  function getInitialData(formItem) {
    // console.log(formItem,"formITem")
    const inputState = formItem
  .flatMap((x) => x.fields?.filter((x) => !x.type.startsWith("checkbox")).map((y) => y.fieldname))
  .reduce((acc, currentValue) => {
    // Find the field object
    const field = formItem.flatMap(x => x.fields).find(field => field.fieldname === currentValue);

    // Check if defaultValue exists and assign it, otherwise assign an empty string
    acc[currentValue] = field && field.defaultValue ? field.defaultValue : "";

    return acc;
  }, {});


      // console.log(inputState,"inputState")

    const checkboxValueState = formItem
      .flatMap((item) => item.fields?.filter((field) => field.type === "checkboxValue"))
      .reduce((acc, field) => {
        const fieldName = field?.fieldname;
        acc[fieldName] = "";
        return acc;
      }, {});

      const checkboxState = formItem
      .flatMap((item) => item.fields?.filter((field) => field.type === "checkboxBoolean"))
      .reduce((acc, field) => {
        const fieldName = field?.fieldname;
        acc[fieldName] = false;
        return acc;
      }, {});


    return { ...inputState, ...checkboxValueState,...checkboxState };
  }
  const handleNext = () => {
    if (activeTab < formItem.length - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  const handleBack = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  //   const inputState = formItem
  //     .flatMap((x) => x.fields.filter((x) => x.type != "checkbox").map((y) => y.fieldname))
  //     .reduce((acc, currentValue) => {
  //       acc[currentValue] = "";
  //       return acc;
  //     }, {});

  // const checkboxState = formItem
  // .flatMap((item) => item.fields.filter((field) => field.type === 'checkbox'))
  // .reduce((acc, field) => {
  //   const fieldName = field.fieldname;
  //   const values = field.values.toString().split(";").map(value => value.trim());
  //   acc[fieldName] = Object.fromEntries(values.map(value => [value, false]));
  //   return acc;
  // }, {});

  //   const checkboxState = formItem
  //     .flatMap((item) => item.fields.filter((field) => field.type === "checkbox"))
  //     .reduce((acc, field) => {
  //       const fieldName = field.fieldname;
  //       //   const values = field.values.toString().split(";").map(value => value.trim());
  //       acc[fieldName] = "";
  //       return acc;
  //     }, {});

  //   const iniState = { ...inputState, ...checkboxState };

  //   const [data, setData] = useState(iniState);
  //   const [processing, setProcessing] = useState(false);

  //   const fields = formItem?.flatMap((x) => x?.fields);

  //   console.log(fields, "field");


  const validateForm = () => {
    const newErrors = {};

    mandatoryFields.forEach(x => {
      if (!formData[x]) {
        console.log("error entered");
        newErrors[x] = mergedObject[x];
    }
  });  

  console.log(newErrors,"newErrors")
    // Validate required fields

    // if (!formData.drugName) {
    //   console.log("error entered")
    //   newErrors.drugName = 'заполните поле';
    // }

    // if (!formData.seriesNumber) {
    //   console.log("error entered")
    //   newErrors.seriesNumber = 'заполните поле';
    // }
    // if (!data.lastname) {
    //   newErrors.lastname = 'заполните поле';
    // }
    // if (!data.email) {
    //   newErrors.email = 'заполните поле';
    // }
    // // if (!data.role) {
    // //   newErrors.role = 'Role is required';
    // // }

    // if (!data.optinPrivacy) {
    //     newErrors.optinPrivacy = `подтвердите согласие`;
    // }

    // if (!data.optinConsent) {
    //     newErrors.optinConsent = 'подтвердите согласие';
    // }

    // if (data.email && !validator.isEmail(data.email)) {
    //   newErrors.email = 'введите действующий адрес электронной почты';
    // }
  
    setErrors(newErrors);
  
    return Object.keys(newErrors).length === 0;
  };

  useEffect(()=> {
    console.log(errors,"errr")
  },[errors])


  const [success, setSuccess] = useState(false);

  const submitData = () => {

    const isFormValid = validateForm();
    // const isFormValid = validateForm();
    if (isFormValid) {
    setProcessing(true);
    axios({
      method: "post",
      //   url: "http://127.0.0.1:1337/api/adverse-events",
      url: `${strapi_url}/api/dynamic-forms`,
      data: { data:{
        entry: formData      }  },
    })
      .then(({ data }) => {
        console.log(data,"data isss")
        // alert("true");
        setSuccess(true);
        setProcessing(false);
      })
      .catch((error) => {
        console.log(error,"errr")
        setProcessing(false);
      });
    }
  };

  const handleDataChange = (field, value) => {
    console.log(field, "field");
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleCheckboxBooleanChange = (field, checked) => {
    console.log("handleCheckboxBooleanChange")
    console.log("field",field)
    console.log("checked",checked)
    setFormData((prevFormData=> {
      return {
        ...prevFormData,
        [field]: checked,
      };
    }))
  }

  const handleCheckboxChange = (field, value, isChecked) => {
    setFormData((prevFormData) => {
      const currentValues = prevFormData[field] || "";
      const selectedValues = currentValues.split(";").map((v) => v.trim()); // Trim each value

      if (isChecked) {
        // If the checkbox is checked, add the value to the array if it's not already present
        if (!selectedValues.includes(value.trim())) {
          // Trim the value being checked
          selectedValues.push(value.trim());
        }
      } else {
        // If the checkbox is unchecked, remove the value from the array
        const index = selectedValues.indexOf(value.trim()); // Trim the value being unchecked
        if (index !== -1) {
          selectedValues.splice(index, 1);
        }
      }

      // Remove leading and trailing semicolons before joining
      const updatedValues = selectedValues.filter(Boolean).join(";");

      return {
        ...prevFormData,
        [field]: updatedValues,
      };
    });
  };

  return (
    // <div className="contact-block-rus-container resp-large-margin">
    //   {success ? (
    //     <div className="contact-us-success">
    //       <svg className="contact-us-success-tick" width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    //         <path d="M47.5 21.4855L43.4637 17.5L26.2177 34.5225L19.0363 27.438L15 31.4235L26.2177 42.5L47.5 21.4855Z" fill="#183568" />
    //       </svg>
    //       <h2 className="contact-us-success-msg">Your enquiry has been successfully sent to our team</h2>
    //       <a href="/" className="contact-us-btn btn light-blue">
    //         RETURN TO HOMEPAGE
    //       </a>
    //     </div>
    //   ) : (
    //     <div className="row">
    //       {formItem.map((x) => {
    //         return (
    //           <div className="field-container">
    //             <label className="field-container-label-main" for={x?.Label}>{x?.Label}</label>
    //             <Row className="fieldComponent-container">

    //             {console.log(x, "formitem x")}
    //             {x?.fields?.map((x) => {
    //               return <DynamicFormBlockItem key={x?.id} fieldDetail={x} data={data} setData={setData} iniState={iniState} />;
    //             })}
    //             </Row>
    //           </div>
    //         );
    //       })}
    //     </div>
    //   )}
    //   <div className="col-md-12 text-center">
    //     <input value={processing ? "Please wait" : "Submit"} disabled={processing} type="submit" className="btn blue" onClick={() => submitData()} />
    //   </div>
    // </div>
    <div className="contact-block-rus-container resp-large-margin">
      {success ? (
        <div className="contact-us-success">
          <svg className="contact-us-success-tick" width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M47.5 21.4855L43.4637 17.5L26.2177 34.5225L19.0363 27.438L15 31.4235L26.2177 42.5L47.5 21.4855Z" fill="#183568" />
          </svg>
          <h2 className="contact-us-success-msg">{successMessage}</h2>
          {/* <a href="/" className="contact-us-btn btn light-blue">
            RETURN TO HOMEPAGE
          </a> */}
        </div>
      ) : (
        <>
          {title && <div className="title">{title}</div>}

          {submitDisclaimer && <div className="message">{submitDisclaimer}</div>}

          {pageLabel && (
            <div className="pageLabel">
              {pageLabel} {activeTab + 1}/{count}
            </div>
          )}
          <div className="field-container">
            <label className="field-container-label-main" htmlFor={formItem[activeTab]?.Label}>
              {formItem[activeTab]?.Label}
            </label>
            <Row className="fieldComponent-container">
              {formItem[activeTab]?.fields?.map((field,index) => (
                <DynamicFormBlockItem
                  key={index}
                  fieldDetail={field}
                  data={formData}
                  setData={(value) => handleDataChange(field.fieldname, value)}
                  iniState={getInitialData([formItem[activeTab]])}
                  handleCheckboxChange={handleCheckboxChange}
                  errors={errors}
                  handleCheckboxBooleanChange={handleCheckboxBooleanChange}
                />
              ))}
            </Row>
          </div>

          {pageLabel && (

<div className="col-md-12 text-center buttonContainer">
<button onClick={handleBack} disabled={activeTab === 0} className="btn blue">
  {backButtonLabel}
</button>
<button onClick={handleNext} disabled={activeTab === formItem.length - 1} className="btn blue">
  {nextButtonLabel}
</button>
</div>
          )}

      

          <div className="col-md-12 text-center submit">
          {submitInfo && <div className="contact-info" dangerouslySetInnerHTML={{ __html: submitInfo }} />}
            <button onClick={submitData} className="btn blue">
            {processingLabel && (processing ? processingLabel : submitButtonLabel)}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DynamicFormBlock;
