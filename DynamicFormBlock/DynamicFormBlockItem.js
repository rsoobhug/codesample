import { Row } from "reactstrap";
import Select from "react-select";
import { Colxx } from "../../shared/Common/CustomBootstrap";


const DynamicFormBlockItem = ({ fieldDetail, setData, errors, iniState, data, label, handleCheckboxChange, handleCheckboxBooleanChange }) => {
  // console.log(data, "data inside contactblockitem");
  let fieldComponent;
  const currentFieldName = fieldDetail?.fieldname;
  // console.log(fieldDetail, "fieldDaetail");
  // console.log(data[fieldDetail.fieldname], "data fieldDetail fieldname")
  const sizes = {
    "n/a": { sm: 12, md: 12, lg: 12 },
    full: { sm: 12, md: 12, lg: 12 },
    "one-half": { sm: 12, md: 6, lg: 6 },
    "one-quarter": { sm: 6, md: 3, lg: 3 },
    "one-third": { sm: 12, md: 4, lg: 4 },
  };

  const getOptions = (item) => {
    return item?.split(/[\r\n]+/).map((x) => {
      return { id: x, label: x };
    });
  };

  switch (fieldDetail.type) {
    case "textblock":
      fieldComponent = (
        // <div className="col-md-4 col-sm-6 col-xs-12 fieldComponent" key={fieldDetail?.fieldname}>
        <Colxx className="fieldComponent" key={fieldDetail.fieldname}
        {...sizes[fieldDetail.sizes]}
        >
          <div class={`form-group header ${errors[currentFieldName] ? "has-error" : ""}`} key={`${fieldDetail?.fieldname} + 2`}>
            <label className="field-container-label" for={fieldDetail?.label}>
              {fieldDetail?.label}
            </label>
            <input
              type="text"
              name={fieldDetail?.fieldname}
              class="form-control"
              id={fieldDetail?.label}
              aria-describedby="emailHelp"
              placeholder={fieldDetail?.placeholder}
              value={data[fieldDetail?.fieldname]}
              onChange={(e) => setData(e.target.value)}
            />
            {errors[currentFieldName] && <span className="error-message">{errors[currentFieldName]}</span>}
          </div>
          </Colxx>
          // </div>

          );
      break;
    case "checkboxValue":
      const xselectedValues = data[fieldDetail.fieldname] ? data[fieldDetail.fieldname].split(";") : [];

      fieldComponent = (
        // <div className="col-md-12 col-sm-12 col-xs-12 fieldComponent" key={`${fieldDetail?.id}x + ${fieldDetail.fieldname}`}>
        <Colxx className="fieldComponent" key={`${fieldDetail?.id}x + ${fieldDetail.fieldname}`}
        {...sizes[fieldDetail.sizes]}
        >
          <div class={`form-group ${errors[currentFieldName] ? "has-error" : ""}`} key={`${fieldDetail?.id}y + 2`}>
            <label className="field-container-label" for={fieldDetail?.label}>
              {fieldDetail?.label}
            </label>
            {fieldDetail.values
              .toString()
              .split(";")
              .map((x, index) => {
                const cleanX = x.trim();
                const isChecked = xselectedValues.includes(cleanX);

                return (
                  <Row key={`${index} + ${fieldDetail.fieldname} + ${fieldDetail.id} +1`}>
                    <div className="col-md-10 col-sm-10 col-xs-7 checkbox-col" key={`${index} + ${fieldDetail.fieldname}z + ${fieldDetail.id} +1`}>
                      <label id={index}>{x}</label>
                    </div>
                    <div className="col-md-2 col-sm-2 col-xs-5 checkbox-col" key={`${index} + ${fieldDetail.fieldname}y + ${fieldDetail.id} +1`}>
                      <input
                        type="checkbox"
                        className="optin-checkbox"
                        id={fieldDetail?.label}
                        name={fieldDetail?.fieldname}
                        checked={isChecked}
                        onChange={(e) => handleCheckboxChange(fieldDetail.fieldname, cleanX, e.target.checked)}
                      />
                    </div>
                  </Row>
                );
              })}
            {errors[currentFieldName] && <span className="error-message">{errors[currentFieldName]}</span>}
          </div>
        </Colxx>
      );
      break;
    case "checkboxBoolean":
      // const selectedValues = data[fieldDetail.fieldname] ? data[fieldDetail.fieldname].split(";") : [];
      // console.log(fieldDetail, "fieldDetail");
      fieldComponent = (
        // <div className="col-md-12 col-sm-12 col-xs-12 fieldComponent" key={`${fieldDetail?.id}x + ${fieldDetail.fieldname}`}>
           <Colxx className="fieldComponent" key={`${fieldDetail?.id}x + ${fieldDetail.fieldname}`}
        {...sizes[fieldDetail.sizes]}
        >
          <div class={`form-group ${errors[currentFieldName] ? "has-error" : ""}`} key={`${fieldDetail?.id}y + 2`}>
            <Row key={`${fieldDetail.fieldname} + 1`}>
            <div className="col-md-2 col-sm-2 col-xs-2 col-lg-1 checkbox-col">
                <input
                  type="checkbox"
                  className="optin-checkbox"
                  id={fieldDetail?.label}
                  name={fieldDetail?.fieldname}
                  checked ={data[fieldDetail.fieldname] == true ? true : false}
                  onChange={(e) => handleCheckboxBooleanChange(fieldDetail.fieldname, e.target.checked)}
                />
              </div>
              <div className="col-md-10 col-sm-10 col-xs-10 col-lg-11 checkbox-col">
                <label>{fieldDetail?.label}</label>
              </div>

            </Row>
            {errors[currentFieldName] && <span className="error-message">{errors[currentFieldName]}</span>}
          </div>
          </Colxx>
      );
      break;
    case "radio":
      fieldComponent = (
        // <div className="col-md-12 col-sm-12 col-xs-12 fieldComponent" key={`${fieldDetail?.id}x + ${fieldDetail.fieldname}`}>
            <Colxx className="fieldComponent" key={`${fieldDetail?.id}x + ${fieldDetail.fieldname}`}
        {...sizes[fieldDetail.sizes]}
        >
          <div class={`form-group ${errors[currentFieldName] ? "has-error" : ""}`} key={fieldDetail?.id}>
            <label className="field-container-label" for={fieldDetail?.label}>
              {fieldDetail?.label}
            </label>
            {fieldDetail.values
              .toString()
              .split(";")
              .map((x, index) => {
                const cleanX = x.trim();
                const radioGroupName = `${fieldDetail.fieldname}-${index}`; // Unique name for each set of radio buttons
                return (
                  <span className="fieldSpan">
                    <label id={index}>{x}</label>
                    <input
                      type="radio"
                      className="optin-radio"
                      name={`${fieldDetail?.label}`}
                      //   name={fieldDetail.fieldname} // Set the name to group radio buttons
                      id={`${fieldDetail?.label}`}
                      checked={cleanX === data[fieldDetail.fieldname]}
                      onChange={() => {
                        setData(cleanX);
                      }}
                    />
                  </span>
                );
              })}
            {errors[currentFieldName] && <span className="error-message">{errors[currentFieldName]}</span>}
          </div>
          </Colxx>
      );
      break;

    case "textarea":
      fieldComponent = (
        // <div className="col-md-9 col-sm-12 fieldComponent" key={fieldDetail?.id}>
              <Colxx className="fieldComponent"  key={fieldDetail?.id}
        {...sizes[fieldDetail.sizes]}
        >
          <div class={`form-group header fix-margin ${errors[currentFieldName] ? "has-error" : ""}`} key={fieldDetail?.id}>
            <label className="field-container-label" for={fieldDetail?.label}>
              {fieldDetail?.label}
            </label>
            <textarea
              rows="6"
              class="form-control"
              id="info"
              aria-describedby="emailHelp"
              placeholder={fieldDetail?.placeholder}
              value={data[fieldDetail?.fieldname]}
              onChange={(e) => setData(e.target.value)}
            />
            {errors[currentFieldName] && <span className="error-message">{errors[currentFieldName]}</span>}
          </div>
          </Colxx>
      );
      break;
    case "dropdown":
      fieldComponent = (


        // <div className="col-md-4 col-sm-6 col-xs-12 fieldComponent" key={fieldDetail?.id}>
           <Colxx className="fieldComponent"  key={fieldDetail?.id}
        {...sizes[fieldDetail.sizes]}
        >
          <div class={`form-group header fix-margin ${errors[currentFieldName] ? "has-error" : ""}`} key={fieldDetail?.id}>
            <label className="field-container-label" for="salutation">{fieldDetail?.label}</label>
            <Select
              name={fieldDetail.fieldname}
              onChange={(e) => setData(e.label)}
              classNamePrefix="react-select-filter-dropdown"
              placeholder={fieldDetail?.placeholder}
              options={getOptions(fieldDetail.values)}
              value={{ label: data[fieldDetail.fieldname]}}

              // value={{ label: data[fieldDetail.fieldname] ?  data[fieldDetail.fieldname] : fieldDetail.defaultValue}}
              // defaultValue={{label: fieldDetail.defaultValue}}
              // menuIsOpen={true}
            />
            {errors[currentFieldName] && <span className="error-message">{errors[currentFieldName]}</span>}
          </div>
          </Colxx>
      );
      break;
    case "date":
      fieldComponent = (
<Colxx className="fieldComponent"  key={fieldDetail?.id}
        {...sizes[fieldDetail.sizes]}
        >          <div class={`form-group header fix-margin ${errors[currentFieldName] ? "has-error" : ""}`} key={fieldDetail?.id}>
            <label for="salutation">{fieldDetail?.label}</label>
            <input type="date" class="form-control" id={fieldDetail?.id} value={data[fieldDetail?.fieldname]} onChange={(e) => setData(e.target.value)} />
            {errors[currentFieldName] && <span className="error-message">{errors[currentFieldName]}</span>}
          </div>
          </Colxx>      );
      break;

    default:
      fieldComponent = <div></div>;
  }

  //   console.log(fieldDetail?.fieldname, "fieldname");
  return <>{fieldComponent}</>;
};

export default DynamicFormBlockItem;
